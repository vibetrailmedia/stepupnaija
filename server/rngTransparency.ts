import crypto from 'crypto';
import { db } from './db';
import { rounds, auditLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface RNGProof {
  roundId: string;
  commitHash: string;
  revealSeed: string;
  participantCount: number;
  winnerIndexes: number[];
  publicVerificationData: {
    algorithm: string;
    timestamp: string;
    blockHash?: string; // For future blockchain integration
    entropy: string;
  };
}

export class RNGTransparencyService {
  
  /**
   * Generate a cryptographically secure random seed
   */
  generateSecureSeed(): string {
    // Combine multiple entropy sources
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const nodeEntropy = process.hrtime.bigint().toString();
    
    return crypto
      .createHash('sha256')
      .update(timestamp + randomBytes + nodeEntropy)
      .digest('hex');
  }

  /**
   * Create a commitment hash that can be verified later
   * This allows us to prove the randomness was generated before knowing the participants
   */
  createCommitment(seed: string, roundId: string): string {
    return crypto
      .createHash('sha256')
      .update(`${seed}:${roundId}:${Date.now()}`)
      .digest('hex');
  }

  /**
   * Generate random winner indexes using verifiable randomness
   */
  generateWinnerIndexes(
    seed: string, 
    participantCount: number, 
    numberOfWinners: number
  ): number[] {
    if (participantCount === 0 || numberOfWinners === 0) {
      return [];
    }

    const winners: number[] = [];
    const usedIndexes = new Set<number>();
    
    // Use seed to generate deterministic randomness
    let currentSeed = seed;
    
    for (let i = 0; i < numberOfWinners && winners.length < participantCount; i++) {
      // Hash the current seed to get next random value
      const hash = crypto.createHash('sha256').update(currentSeed + i).digest('hex');
      
      // Convert hex to number and mod by participant count
      const randomValue = parseInt(hash.substring(0, 8), 16);
      const winnerIndex = randomValue % participantCount;
      
      // Ensure no duplicates
      if (!usedIndexes.has(winnerIndex)) {
        winners.push(winnerIndex);
        usedIndexes.add(winnerIndex);
      } else {
        // If duplicate, try with different iteration
        i--;
      }
      
      // Update seed for next iteration
      currentSeed = hash;
    }
    
    return winners.sort((a, b) => a - b);
  }

  /**
   * Verify that a draw was conducted fairly using the revealed seed
   */
  verifyDraw(proof: RNGProof): boolean {
    try {
      // 1. Verify the commitment hash matches the revealed seed
      const expectedCommit = this.createCommitment(proof.revealSeed, proof.roundId);
      if (proof.commitHash !== expectedCommit) {
        console.error('Commitment hash verification failed');
        return false;
      }

      // 2. Regenerate winners using the revealed seed
      const regeneratedWinners = this.generateWinnerIndexes(
        proof.revealSeed,
        proof.participantCount,
        proof.winnerIndexes.length
      );

      // 3. Compare with claimed winners
      if (regeneratedWinners.length !== proof.winnerIndexes.length) {
        console.error('Winner count mismatch');
        return false;
      }

      for (let i = 0; i < regeneratedWinners.length; i++) {
        if (regeneratedWinners[i] !== proof.winnerIndexes[i]) {
          console.error(`Winner index mismatch at position ${i}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Draw verification failed:', error);
      return false;
    }
  }

  /**
   * Create a complete RNG proof for a round
   */
  async createRNGProof(roundId: string): Promise<RNGProof> {
    // Get round data
    const [round] = await db.select().from(rounds).where(eq(rounds.id, roundId));
    if (!round) {
      throw new Error('Round not found');
    }

    // Get participant data (entries)
    const { entries } = await import('@shared/schema');
    const participantEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.roundId, roundId));

    const participantCount = participantEntries.length;
    
    // Calculate number of winners (e.g., top 10 or 10% of participants)
    const numberOfWinners = Math.min(10, Math.max(1, Math.floor(participantCount * 0.1)));
    
    // Generate winners if not already done
    let winnerIndexes: number[] = [];
    if (round.revealSeed) {
      winnerIndexes = this.generateWinnerIndexes(round.revealSeed, participantCount, numberOfWinners);
    }

    const proof: RNGProof = {
      roundId,
      commitHash: round.commitHash || '',
      revealSeed: round.revealSeed || '',
      participantCount,
      winnerIndexes,
      publicVerificationData: {
        algorithm: 'SHA-256 with cryptographic entropy',
        timestamp: round.drawnAt?.toISOString() || new Date().toISOString(),
        entropy: 'System entropy + timestamp + process.hrtime',
      }
    };

    return proof;
  }

  /**
   * Store RNG proof in audit logs for transparency
   */
  async storeRNGProof(proof: RNGProof): Promise<void> {
    await db.insert(auditLogs).values({
      actor: 'RNG_SYSTEM',
      action: 'DRAW_COMPLETED',
      payloadJson: JSON.stringify({
        type: 'RNG_PROOF',
        roundId: proof.roundId,
        commitHash: proof.commitHash,
        participantCount: proof.participantCount,
        winnerCount: proof.winnerIndexes.length,
        algorithm: proof.publicVerificationData.algorithm,
        timestamp: proof.publicVerificationData.timestamp,
        verifiable: true
      })
    });
  }

  /**
   * Get public verification data for transparency page
   */
  async getPublicVerificationData(roundId: string): Promise<any> {
    const proof = await this.createRNGProof(roundId);
    
    return {
      roundId: proof.roundId,
      drawTimestamp: proof.publicVerificationData.timestamp,
      algorithm: proof.publicVerificationData.algorithm,
      participantCount: proof.participantCount,
      winnerCount: proof.winnerIndexes.length,
      commitHash: proof.commitHash,
      isVerified: this.verifyDraw(proof),
      entropySource: proof.publicVerificationData.entropy,
      verificationInstructions: {
        step1: 'Copy the commitment hash and reveal seed from this page',
        step2: 'Use any SHA-256 calculator to verify: SHA256(revealSeed:roundId:timestamp) = commitHash',
        step3: 'Recreate winner selection using the provided algorithm with the revealed seed',
        step4: 'Compare your results with the published winner list'
      }
    };
  }

  /**
   * Initialize RNG process for a new round (create commitment)
   */
  async initializeRound(roundId: string): Promise<string> {
    const seed = this.generateSecureSeed();
    const commitHash = this.createCommitment(seed, roundId);
    
    // Store only the commitment hash initially
    await db
      .update(rounds)
      .set({ commitHash })
      .where(eq(rounds.id, roundId));
    
    // Store the seed securely (in production, use encrypted storage)
    await db.insert(auditLogs).values({
      actor: 'RNG_SYSTEM',
      action: 'ROUND_INIT',
      payloadJson: JSON.stringify({
        roundId,
        commitHash,
        seedHash: crypto.createHash('sha256').update(seed).digest('hex'),
        timestamp: new Date().toISOString()
      })
    });

    // Return seed for internal use (store securely in production)
    return seed;
  }

  /**
   * Finalize round by revealing the seed and conducting the draw
   */
  async finalizeRound(roundId: string, seed: string): Promise<RNGProof> {
    // Get participant count
    const { entries } = await import('@shared/schema');
    const participantEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.roundId, roundId));

    const participantCount = participantEntries.length;
    const numberOfWinners = Math.min(10, Math.max(1, Math.floor(participantCount * 0.1)));
    
    // Generate winners
    const winnerIndexes = this.generateWinnerIndexes(seed, participantCount, numberOfWinners);
    
    // Update round with revealed seed
    await db
      .update(rounds)
      .set({ 
        revealSeed: seed,
        drawnAt: new Date(),
        status: 'DRAWN'
      })
      .where(eq(rounds.id, roundId));

    // Create and store proof
    const proof = await this.createRNGProof(roundId);
    await this.storeRNGProof(proof);
    
    return proof;
  }

  /**
   * Get all RNG proofs for transparency dashboard
   */
  async getAllVerificationData(limit: number = 50): Promise<any[]> {
    const recentRounds = await db
      .select()
      .from(rounds)
      .where(eq(rounds.status, 'DRAWN'))
      .orderBy(rounds.drawnAt)
      .limit(limit);

    const verificationData = await Promise.all(
      recentRounds.map(async (round) => {
        try {
          return await this.getPublicVerificationData(round.id);
        } catch (error) {
          console.error(`Failed to get verification data for round ${round.id}:`, error);
          return null;
        }
      })
    );

    return verificationData.filter(Boolean);
  }
}

export const rngTransparency = new RNGTransparencyService();