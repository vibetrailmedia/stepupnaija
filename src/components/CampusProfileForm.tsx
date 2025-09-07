import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Users, 
  Award, 
  MapPin, 
  Building, 
  Calendar,
  User,
  CheckCircle2,
  ArrowRight,
  Shield
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Nigerian Universities and Institutions Data
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const INSTITUTION_TYPES = [
  { value: 'federal_university', label: 'Federal University' },
  { value: 'state_university', label: 'State University' },
  { value: 'private_university', label: 'Private University' },
  { value: 'polytechnic', label: 'Polytechnic' },
  { value: 'college_education', label: 'College of Education' },
  { value: 'monotechnic', label: 'Monotechnic' },
  { value: 'nysc_camp', label: 'NYSC Camp' }
];

const LEADERSHIP_POSITIONS = [
  { value: 'student_union_president', label: 'Student Union President', category: 'executive' },
  { value: 'student_union_vp', label: 'Student Union Vice President', category: 'executive' },
  { value: 'student_union_secretary', label: 'Student Union Secretary', category: 'executive' },
  { value: 'faculty_president', label: 'Faculty President', category: 'faculty' },
  { value: 'department_representative', label: 'Department Representative', category: 'faculty' },
  { value: 'class_representative', label: 'Class Representative', category: 'academic' },
  { value: 'hostel_leader', label: 'Hostel Leader', category: 'residential' },
  { value: 'club_president', label: 'Club/Society President', category: 'organizations' },
  { value: 'nysc_camp_governor', label: 'NYSC Camp Governor', category: 'nysc' },
  { value: 'nysc_platoon_leader', label: 'NYSC Platoon Leader', category: 'nysc' },
  { value: 'cds_coordinator', label: 'CDS Group Coordinator', category: 'nysc' },
  { value: 'aspiring_leader', label: 'Aspiring Campus Leader', category: 'emerging' }
];

const POPULAR_INSTITUTIONS = {
  federal_university: [
    'University of Ibadan', 'University of Lagos (UNILAG)', 'Ahmadu Bello University (ABU)',
    'University of Nigeria, Nsukka (UNN)', 'Obafemi Awolowo University (OAU)', 'University of Benin (UNIBEN)',
    'Federal University of Technology, Akure (FUTA)', 'University of Jos (UNIJOS)', 'University of Calabar (UNICAL)',
    'Federal University of Technology, Minna (FUTMINNA)'
  ],
  state_university: [
    'Lagos State University (LASU)', 'Nnamdi Azikiwe University (UNIZIK)', 'Ekiti State University (EKSU)',
    'Kaduna State University (KASU)', 'Kano State University of Science and Technology (KUST)',
    'Delta State University (DELSU)', 'Rivers State University', 'Imo State University (IMSU)'
  ],
  private_university: [
    'Covenant University', 'Babcock University', 'American University of Nigeria (AUN)',
    'Bowen University', 'Landmark University', 'Redeemer\'s University', 'Pan-Atlantic University',
    'Afe Babalola University', 'Bells University'
  ]
};

const campusProfileSchema = z.object({
  institutionType: z.string().min(1, 'Please select institution type'),
  institutionName: z.string().min(1, 'Institution name is required'),
  customInstitutionName: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  leadershipPosition: z.string().min(1, 'Please select your leadership position'),
  faculty: z.string().optional(),
  department: z.string().optional(),
  yearOfStudy: z.string().optional(),
  graduationYear: z.string().optional(),
  leadership_experience: z.string().min(10, 'Please describe your leadership experience (minimum 10 characters)'),
  civic_interests: z.string().min(10, 'Please describe your civic interests (minimum 10 characters)'),
  phone: z.string().min(10, 'Phone number is required'),
  whatsapp: z.string().optional(),
  social_media: z.string().optional(),
  goals: z.string().min(10, 'Please describe your leadership goals')
});

type CampusProfileFormData = z.infer<typeof campusProfileSchema>;

interface CampusProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CampusProfileForm({ onSuccess, onCancel }: CampusProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampusProfileFormData>({
    resolver: zodResolver(campusProfileSchema),
    defaultValues: {
      institutionType: '',
      institutionName: '',
      customInstitutionName: '',
      state: '',
      leadershipPosition: '',
      faculty: '',
      department: '',
      yearOfStudy: '',
      graduationYear: '',
      leadership_experience: '',
      civic_interests: '',
      phone: '',
      whatsapp: '',
      social_media: '',
      goals: ''
    }
  });

  const institutionType = form.watch('institutionType');
  const leadershipPosition = form.watch('leadershipPosition');

  const createProfileMutation = useMutation({
    mutationFn: async (data: CampusProfileFormData) => {
      return await apiRequest('/api/campus-profiles', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Campus Profile Created! 🎓",
        description: "Your campus leadership profile has been successfully created. Welcome to the Step Up Naija campus community!",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Profile Creation Failed",
        description: error.message || "Failed to create campus profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: CampusProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['institutionType', 'institutionName', 'state'] as (keyof CampusProfileFormData)[];
      case 2:
        return ['leadershipPosition', 'faculty', 'department'] as (keyof CampusProfileFormData)[];
      case 3:
        return ['leadership_experience', 'civic_interests', 'goals'] as (keyof CampusProfileFormData)[];
      case 4:
        return ['phone'] as (keyof CampusProfileFormData)[];
      default:
        return [];
    }
  };

  const getAvailableInstitutions = () => {
    if (!institutionType) return [];
    return POPULAR_INSTITUTIONS[institutionType as keyof typeof POPULAR_INSTITUTIONS] || [];
  };

  const getPositionsByCategory = (category: string) => {
    return LEADERSHIP_POSITIONS.filter(pos => pos.category === category);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">
          Create Your Campus Leadership Profile
        </CardTitle>
        <p className="text-lg text-gray-600 mt-2">
          Join thousands of Nigerian campus leaders driving civic engagement across all 774 LGAs
        </p>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <ArrowRight className={`h-4 w-4 mx-2 ${currentStep > step ? 'text-green-600' : 'text-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Institution Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Institution Information</h3>
                  <p className="text-gray-600">Tell us about your educational institution</p>
                </div>

                <FormField
                  control={form.control}
                  name="institutionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-institution-type">
                            <SelectValue placeholder="Select institution type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INSTITUTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-institution-name">
                            <SelectValue placeholder="Select your institution" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableInstitutions().map((institution) => (
                            <SelectItem key={institution} value={institution}>
                              {institution}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Please specify)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('institutionName') === 'other' && (
                  <FormField
                    control={form.control}
                    name="customInstitutionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Name (Custom) *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your institution name" 
                            {...field}
                            data-testid="input-custom-institution"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NIGERIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Leadership Position */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Leadership Position</h3>
                  <p className="text-gray-600">What leadership role do you hold or aspire to?</p>
                </div>

                <FormField
                  control={form.control}
                  name="leadershipPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leadership Position *</FormLabel>
                      <Tabs defaultValue="executive" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="executive">Executive</TabsTrigger>
                          <TabsTrigger value="faculty">Faculty</TabsTrigger>
                          <TabsTrigger value="organizations">Organizations</TabsTrigger>
                          <TabsTrigger value="nysc">NYSC</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="executive" className="space-y-3">
                          {getPositionsByCategory('executive').map((position) => (
                            <div key={position.value} 
                                 className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                   field.value === position.value 
                                     ? 'border-green-500 bg-green-50' 
                                     : 'border-gray-200 hover:border-gray-300'
                                 }`}
                                 onClick={() => field.onChange(position.value)}
                                 data-testid={`position-${position.value}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Award className="h-5 w-5 text-green-600" />
                                  <span className="font-medium">{position.label}</span>
                                </div>
                                {field.value === position.value && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="faculty" className="space-y-3">
                          {getPositionsByCategory('faculty').map((position) => (
                            <div key={position.value} 
                                 className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                   field.value === position.value 
                                     ? 'border-green-500 bg-green-50' 
                                     : 'border-gray-200 hover:border-gray-300'
                                 }`}
                                 onClick={() => field.onChange(position.value)}
                                 data-testid={`position-${position.value}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Users className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium">{position.label}</span>
                                </div>
                                {field.value === position.value && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="organizations" className="space-y-3">
                          {getPositionsByCategory('organizations').map((position) => (
                            <div key={position.value} 
                                 className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                   field.value === position.value 
                                     ? 'border-green-500 bg-green-50' 
                                     : 'border-gray-200 hover:border-gray-300'
                                 }`}
                                 onClick={() => field.onChange(position.value)}
                                 data-testid={`position-${position.value}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Building className="h-5 w-5 text-purple-600" />
                                  <span className="font-medium">{position.label}</span>
                                </div>
                                {field.value === position.value && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="nysc" className="space-y-3">
                          {getPositionsByCategory('nysc').map((position) => (
                            <div key={position.value} 
                                 className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                   field.value === position.value 
                                     ? 'border-green-500 bg-green-50' 
                                     : 'border-gray-200 hover:border-gray-300'
                                 }`}
                                 onClick={() => field.onChange(position.value)}
                                 data-testid={`position-${position.value}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Shield className="h-5 w-5 text-teal-600" />
                                  <span className="font-medium">{position.label}</span>
                                </div>
                                {field.value === position.value && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty/School</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Engineering, Medicine, Arts" 
                            {...field}
                            data-testid="input-faculty"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Computer Science, Political Science" 
                            {...field}
                            data-testid="input-department"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Experience & Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Leadership Experience & Goals</h3>
                  <p className="text-gray-600">Share your experience and vision for civic leadership</p>
                </div>

                <FormField
                  control={form.control}
                  name="leadership_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leadership Experience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your leadership experience, achievements, and any positions you've held..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-leadership-experience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="civic_interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Civic Interests *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What civic issues are you passionate about? (e.g., youth development, governance, community service)"
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-civic-interests"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leadership Goals *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What are your goals as a campus leader? How do you want to impact your institution and community?"
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-gray-600">How can other campus leaders connect with you?</p>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+234 808 000 0000" 
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+234 808 000 0000 (if different from phone)" 
                          {...field}
                          data-testid="input-whatsapp"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Profile</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Twitter, Instagram, or LinkedIn profile URL" 
                          {...field}
                          data-testid="input-social-media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Summary Card */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Profile Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-700 space-y-2">
                    <p><strong>Institution:</strong> {form.watch('institutionName') || 'Not specified'}</p>
                    <p><strong>Position:</strong> {LEADERSHIP_POSITIONS.find(p => p.value === form.watch('leadershipPosition'))?.label || 'Not specified'}</p>
                    <p><strong>State:</strong> {form.watch('state') || 'Not specified'}</p>
                    <p><strong>Faculty:</strong> {form.watch('faculty') || 'Not specified'}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="button-previous"
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next"
                >
                  Next
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProfileMutation.isPending}
                    data-testid="button-create-profile"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createProfileMutation.isPending ? 'Creating Profile...' : 'Create Profile'}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}