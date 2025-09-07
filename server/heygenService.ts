import sharp from "sharp";

interface HeyGenVideoRequest {
  test?: boolean; // Set to false for paid subscribers to remove watermark
  video_inputs: Array<{
    character: {
      type: "avatar" | "talking_photo";
      avatar_id?: string;
      avatar_style?: string;
      talking_photo_id?: string;
    };
    voice: {
      type: "text";
      input_text: string;
      voice_id: string;
      speed?: number;
    };
    background?: {
      type: "color" | "image";
      value: string;
    };
  }>;
  dimension?: {
    width: number;
    height: number;
  };
  aspect_ratio?: string;
}

interface HeyGenVideoResponse {
  error: string | null;
  data?: {
    video_id: string;
  };
}

interface HeyGenVideoStatus {
  error: string | null;
  data?: {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    video_url?: string;
    thumbnail_url?: string;
    duration?: number;
  };
}

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
}

interface HeyGenVoice {
  voice_id: string;
  language: string;
  gender: string;
  name: string;
  preview_audio: string;
}

export class HeyGenService {
  private apiKey: string;
  private baseUrl = "https://api.heygen.com";
  private uploadUrl = "https://upload.heygen.com";

  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("HEYGEN_API_KEY is required");
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Api-Key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listAvatars(): Promise<HeyGenAvatar[]> {
    const response = await this.makeRequest<{ data: { avatars: HeyGenAvatar[] } }>("/v2/avatars");
    return response.data.avatars;
  }

  async listVoices(): Promise<HeyGenVoice[]> {
    const response = await this.makeRequest<{ data: { voices: HeyGenVoice[] } }>("/v2/voices");
    return response.data.voices;
  }

  async listCustomVoices(): Promise<HeyGenVoice[]> {
    try {
      // Try to get custom/brand voices from user's account
      const response = await this.makeRequest<{ data: { voices?: HeyGenVoice[] } }>("/v1/brand_voice/list");
      return response.data.voices || [];
    } catch (error) {
      console.log("Custom voices endpoint not available or empty:", error);
      return [];
    }
  }

  async getAllVoices(): Promise<HeyGenVoice[]> {
    try {
      // Get both standard and custom voices
      const [standardVoices, customVoices] = await Promise.all([
        this.listVoices(),
        this.listCustomVoices()
      ]);
      
      // Combine and mark custom voices
      const allVoices = [
        ...customVoices.map(voice => ({ ...voice, isCustom: true })),
        ...standardVoices.map(voice => ({ ...voice, isCustom: false }))
      ];
      
      return allVoices;
    } catch (error) {
      console.error("Error fetching all voices:", error);
      // Fallback to just standard voices
      return this.listVoices();
    }
  }

  async createVideo(request: HeyGenVideoRequest): Promise<string> {
    console.log('Sending video request:', JSON.stringify(request, null, 2));
    
    const response = await this.makeRequest<HeyGenVideoResponse>("/v2/video/generate", {
      method: "POST",
      body: JSON.stringify(request),
    });

    console.log('HeyGen API response:', JSON.stringify(response, null, 2));

    if (response.error) {
      throw new Error(`HeyGen video creation failed: ${response.error}`);
    }

    if (!response.data?.video_id) {
      throw new Error("No video ID returned from HeyGen");
    }

    return response.data.video_id;
  }

  async getVideoStatus(videoId: string): Promise<HeyGenVideoStatus["data"]> {
    const response = await this.makeRequest<HeyGenVideoStatus>(`/v1/video_status.get?video_id=${videoId}`);
    
    if (response.error) {
      throw new Error(`HeyGen video status check failed: ${response.error}`);
    }

    return response.data;
  }

  async uploadAsset(imageUrl: string): Promise<string> {
    // First fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer], { type: 'image/webp' }), 'avatar.webp');

    const response = await fetch(`${this.baseUrl}/v1/assets`, {
      method: "POST",
      headers: {
        "X-Api-Key": this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HeyGen asset upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(`HeyGen asset upload failed: ${result.error}`);
    }

    return result.data.url;
  }

  async createPhotoAvatarGroup(imageUrl: string, avatarName: string): Promise<string> {
    console.log("WARNING: createPhotoAvatarGroup is deprecated, use createPhotoAvatar instead");
    return this.createPhotoAvatar(imageUrl, avatarName);
  }

  async createPhotoAvatar(imageUrl: string, avatarName: string): Promise<string> {
    console.log(`Attempting to create photo avatar with URL: ${imageUrl}`);
    
    try {
      // First, fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      console.log(`Original image size: ${imageBuffer.byteLength} bytes`);
      console.log(`Original content type: ${imageResponse.headers.get('content-type')}`);
      
      // Convert image to JPEG format since HeyGen requires it
      let processedImageBuffer: Buffer;
      let contentType = 'image/jpeg';
      
      try {
        // Use Sharp to convert any format to JPEG
        const inputBuffer = Buffer.from(imageBuffer);
        console.log(`Input buffer size: ${inputBuffer.length} bytes`);
        
        processedImageBuffer = await sharp(inputBuffer)
          .jpeg({ quality: 85 })
          .toBuffer();
        
        console.log(`Converted image size: ${processedImageBuffer.length} bytes`);
        console.log('Successfully converted image to JPEG format for HeyGen');
      } catch (error) {
        console.error('Error converting image with Sharp:', error);
        // Fallback to original buffer if conversion fails
        processedImageBuffer = Buffer.from(imageBuffer);
        console.log('Using original buffer as fallback');
      }
      
      // Try raw binary upload as shown in the documentation
      console.log('Uploading as raw binary data with Content-Type header');
      
      // Upload to HeyGen's upload endpoint
      const uploadResponse = await fetch(`${this.uploadUrl}/v1/talking_photo`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,  // Use lowercase as per documentation
          "Content-Type": contentType,
        },
        body: processedImageBuffer,  // Send raw buffer directly
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`HeyGen upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
        throw new Error(`HeyGen upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      const result = await uploadResponse.json();
      console.log("HeyGen upload response:", result);

      if (result.code !== 100) {
        console.error(`HeyGen talking photo creation failed: ${result.message}`);
        throw new Error(`HeyGen talking photo creation failed: ${result.message}`);
      }

      if (!result.data?.talking_photo_id) {
        console.error("No talking photo ID returned from HeyGen");
        throw new Error("No talking photo ID returned from HeyGen");
      }

      console.log(`Successfully created talking photo with ID: ${result.data.talking_photo_id}`);
      return result.data.talking_photo_id;
    } catch (error) {
      console.error("Full error creating photo avatar:", error);
      throw error;
    }
  }

  async waitForVideoCompletion(videoId: string, maxWaitTime = 300000): Promise<string> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getVideoStatus(videoId);
      
      if (status?.status === "completed" && status.video_url) {
        return status.video_url;
      } else if (status?.status === "failed") {
        throw new Error("Video generation failed");
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    throw new Error("Video generation timeout");
  }

  // Predefined scripts for Tari and Kamsi
  static readonly SCRIPTS = {
    tari: {
      introduction: "Hello! I'm Tari, your dedicated civic authority guide and trusted mentor for navigating Nigeria's complex democratic landscape. My mission is to empower you with the knowledge, tools, and confidence you need to become an active, informed citizen who can make a real difference in our great nation. Whether you're just beginning your civic journey or looking to deepen your engagement, I'm here to guide you through understanding our government systems, from local councils to the federal level. I'll help you master the voting process, understand your constitutional rights, learn how to access government services, and discover practical ways to hold our leaders accountable. Together, we'll explore how democracy works in Nigeria, how you can participate meaningfully in the political process, and how your voice can contribute to the positive transformation of our communities. I believe that every Nigerian has the power to shape our nation's future, and I'm here to help you unlock that power. Welcome to your civic awakening journey - let's build the Nigeria we all deserve, one informed citizen at a time.",
      welcome: "Welcome to Step Up Naija! I'm Tari, and I'll be your guide through Nigeria's civic landscape. Let's explore how you can make a real difference in your community.",
      voting: "Understanding your voting rights is crucial for civic participation. Let me walk you through Nigeria's electoral process, from voter registration to casting your ballot on election day.",
      platform_intro: "Hello, I'm Tari - your dedicated civic authority guide and personal mentor for Nigeria's democratic transformation. Welcome to Step Up Naija, where we're not just building informed citizens - we're cultivating the next generation of Nigerian leaders who will shape our nation's future. This platform is your gateway to understanding government systems, mastering your constitutional rights, and developing the civic skills that will empower you to drive real change in your community. From navigating complex voting processes to accessing government services, from understanding policy impacts to becoming an effective advocate for your community's needs - I'm here to guide you every step of the way. Together, we'll transform you from a passive observer into an active architect of Nigeria's democratic progress. Your civic journey starts now, and I'll be with you throughout this empowering transformation. Welcome to your leadership awakening.",
      civic_empowerment: "I'm Tari, and I believe every Nigerian has the power to transform their community and nation. Civic empowerment isn't just about knowing your rights - it's about exercising them with confidence and purpose. Whether you're holding your local government accountable, advocating for better infrastructure, or leading grassroots initiatives for change, you have more power than you realize. From understanding how to access public information and engage with government officials, to organizing peaceful advocacy campaigns and building coalitions for change - these are the tools that turn ordinary citizens into extraordinary change-makers. Your voice matters. Your vote counts. Your actions create ripple effects that can transform entire communities. Stop waiting for someone else to fix what's broken. You are the leader Nigeria has been waiting for. Let's unlock your civic power and put it to work for the Nigeria we all deserve."
    },
    kamsi: {
      introduction: "Hi there! I'm Kamsi, your community connection guide. I'm here to help you build meaningful relationships, find volunteer opportunities, and create positive change in your neighborhood. Let's grow together as engaged citizens!",
      welcome: "Welcome to our amazing community! I'm Kamsi, and I'm so excited to help you connect with fellow Nigerians who are passionate about making a difference. Your civic journey starts here!",
      community: "Building strong communities starts with each of us. Let me show you how to find local volunteer opportunities, connect with like-minded citizens, and create lasting positive impact.",
      platform_intro: "Hello, I'm Kamsi - your vibrant community connection guide and passionate advocate for Nigerian unity! Welcome to Step Up Naija, where we're building more than just a platform - we're creating a movement that connects hearts, minds, and hands across all 774 Local Government Areas of Nigeria. This is your home for discovering meaningful volunteer opportunities, building lasting friendships with like-minded change-makers, and turning your passion for community service into real, measurable impact. From organizing local clean-up drives to connecting with mentors and fellow activists, from finding your perfect volunteer match to celebrating collective achievements - I'm here to ensure you never walk this journey alone. Together, we'll transform individual good intentions into a powerful network of community champions who are actively rebuilding Nigeria from the grassroots up. Your community adventure begins now, and I'll be your enthusiastic companion every step of the way. Welcome to your tribe!"
    }
  };

  // Helper method to create videos with custom avatars
  async createVideoWithAvatar(script: string, avatarId: string, voiceId: string, isCustomAvatar: boolean = false, backgroundColor: string = "#1e40af"): Promise<string> {
    const characterConfig = isCustomAvatar ? {
      type: "talking_photo" as const,
      talking_photo_id: avatarId
    } : {
      type: "avatar" as const,
      avatar_id: avatarId,
      avatar_style: "normal"
    };
    
    console.log(`Creating video with ${isCustomAvatar ? 'talking_photo' : 'avatar'} ID: ${avatarId}`);

    return this.createVideo({
      test: false, // Important: Set to false for paid subscribers to remove watermark
      video_inputs: [{
        character: characterConfig,
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId,
          speed: 1.0
        },
        background: {
          type: "color",
          value: backgroundColor
        }
      }],
      dimension: {
        width: 854,
        height: 480
      },
      aspect_ratio: "16:9"
    });
  }

  // Helper method to create Tari videos
  async createTariVideo(script: string, avatarId: string, voiceId: string, isCustomAvatar: boolean = false): Promise<string> {
    return this.createVideoWithAvatar(script, avatarId, voiceId, isCustomAvatar, "#1e40af");
  }

  // Helper method to create Kamsi videos
  async createKamsiVideo(script: string, avatarId: string, voiceId: string, isCustomAvatar: boolean = false): Promise<string> {
    return this.createVideoWithAvatar(script, avatarId, voiceId, isCustomAvatar, "#059669");
  }
}