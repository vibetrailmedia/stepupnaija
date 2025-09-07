import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Plus, 
  Calendar, 
  DollarSign, 
  Receipt, 
  Camera,
  Target,
  CheckCircle,
  Clock,
  Image,
  Link,
  Users,
  TrendingUp
} from "lucide-react";
import type { Project, ProjectUpdate } from "@shared/schema";

interface ProjectImpactReportsProps {
  project: Project;
  isOwner?: boolean;
  showCreateForm?: boolean;
  className?: string;
}

export function ProjectImpactReports({ 
  project, 
  isOwner = false, 
  showCreateForm = false,
  className = "" 
}: ProjectImpactReportsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(showCreateForm);
  const [updateType, setUpdateType] = useState('progress');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  // Fetch project updates
  const { data: updates, isLoading } = useQuery<ProjectUpdate[]>({
    queryKey: ["/api/projects", project.id, "updates"],
  });

  // Create update mutation
  const createUpdateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const res = await apiRequest("POST", `/api/projects/${project.id}/updates`, updateData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Update Published! 📢",
        description: "Your project update has been shared with supporters.",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "updates"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Publish Update",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setAmountSpent('');
    setImageUrl('');
    setReceiptUrl('');
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for the update.",
        variant: "destructive",
      });
      return;
    }

    createUpdateMutation.mutate({
      type: updateType,
      title: title.trim(),
      description: description.trim(),
      amountSpent: amountSpent ? parseFloat(amountSpent).toString() : null,
      imageUrl: imageUrl.trim() || null,
      receiptUrl: receiptUrl.trim() || null,
    });
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="h-5 w-5 text-blue-600" />;
      case 'completion': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expense': return <Receipt className="h-5 w-5 text-purple-600" />;
      default: return <TrendingUp className="h-5 w-5 text-gray-600" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'border-blue-200 bg-blue-50';
      case 'completion': return 'border-green-200 bg-green-50';
      case 'expense': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <Card className={`border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Project Impact Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              Project Impact Reports
            </CardTitle>
            {isOwner && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Update
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Transparent updates showing how your donations create real impact
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Create Update Form */}
          {showForm && isOwner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-4 rounded-lg border-2 border-indigo-200"
            >
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                Create Impact Update
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'progress', label: 'Progress', icon: TrendingUp },
                    { value: 'milestone', label: 'Milestone', icon: Target },
                    { value: 'expense', label: 'Expense', icon: Receipt },
                    { value: 'completion', label: 'Completion', icon: CheckCircle },
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      onClick={() => setUpdateType(value)}
                      variant={updateType === value ? "default" : "outline"}
                      size="sm"
                      className={`justify-start ${updateType === value ? 'bg-indigo-600' : ''}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Title
                  </label>
                  <Input
                    placeholder="e.g., Water system installation completed"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe the progress, impact, or milestone achieved..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-indigo-300 focus:border-indigo-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {updateType === 'expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Spent (NGN)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={amountSpent}
                        onChange={(e) => setAmountSpent(e.target.value)}
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo URL (optional)
                    </label>
                    <Input
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="border-indigo-300 focus:border-indigo-500"
                    />
                  </div>

                  {updateType === 'expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receipt URL (optional)
                      </label>
                      <Input
                        placeholder="https://..."
                        value={receiptUrl}
                        onChange={(e) => setReceiptUrl(e.target.value)}
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={createUpdateMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createUpdateMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Publish Update
                      </>
                    )}
                  </Button>
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project Updates Timeline */}
          {updates && updates.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Impact Timeline ({updates.length} updates)
              </h4>

              <div className="space-y-4">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${getUpdateColor(update.type)} relative`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-white rounded-full border border-gray-200">
                        {getUpdateIcon(update.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-900">{update.title}</h5>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Clock className="h-4 w-4" />
                              {new Date(update.createdAt!).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {update.type}
                          </Badge>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-3">
                          {update.description}
                        </p>

                        {/* Additional Info Row */}
                        <div className="flex items-center gap-4 text-sm">
                          {update.amountSpent && (
                            <div className="flex items-center gap-1 text-purple-600 font-medium">
                              <DollarSign className="h-4 w-4" />
                              {formatAmount(update.amountSpent)}
                            </div>
                          )}

                          {update.imageUrl && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Image className="h-4 w-4" />
                              <a 
                                href={update.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                View Photo
                              </a>
                            </div>
                          )}

                          {update.receiptUrl && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Receipt className="h-4 w-4" />
                              <a 
                                href={update.receiptUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                View Receipt
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Image Preview */}
                        {update.imageUrl && (
                          <div className="mt-3">
                            <img 
                              src={update.imageUrl} 
                              alt={update.title}
                              className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                No Impact Reports Yet
              </h4>
              <p className="text-gray-500 mb-4">
                {isOwner 
                  ? "Share updates with your supporters to build trust and showcase impact."
                  : "Impact reports will appear here as the project owner shares updates."
                }
              </p>
              {isOwner && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Update
                </Button>
              )}
            </div>
          )}

          {/* Impact Summary */}
          {updates && updates.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">Transparency Impact</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{updates.length}</div>
                  <div className="text-sm text-green-600">Updates Shared</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {updates.filter(u => u.amountSpent).length}
                  </div>
                  <div className="text-sm text-green-600">Expense Reports</div>
                </div>
                <div className="sm:col-span-1 col-span-2">
                  <div className="text-lg font-bold text-green-600">
                    {formatAmount(
                      updates
                        .filter(u => u.amountSpent)
                        .reduce((sum, u) => sum + parseFloat(u.amountSpent!), 0)
                        .toString()
                    )}
                  </div>
                  <div className="text-sm text-green-600">Total Documented</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}