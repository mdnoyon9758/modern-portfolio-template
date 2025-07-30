import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceApi } from '../../services/portfolioApi';
import { Experience } from '../../types/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ExperienceManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(null);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin', 'experience'],
    queryFn: () => experienceApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (experienceData: Omit<Experience, 'id' | 'created_at'>) => experienceApi.create(experienceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experience'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, experienceData }: { id: number; experienceData: Partial<Experience> }) => experienceApi.update(id, experienceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experience'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'experience'] });
    },
  });

  const openModal = (experience: Experience | null = null) => {
    setExperienceToEdit(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setExperienceToEdit(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, position: string, company: string) => {
    if (window.confirm(`Are you sure you want to delete "${position} at ${company}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const experienceData = {
      ...data,
      start_date: new Date(data.start_date as string).toISOString(),
      end_date: data.end_date ? new Date(data.end_date as string).toISOString() : null,
      current: data.current === 'on',
      order_index: Number(data.order_index),
    } as Omit<Experience, 'id' | 'created_at'>;

    if (experienceToEdit) {
      updateMutation.mutate({ id: experienceToEdit.id, experienceData });
    } else {
      createMutation.mutate(experienceData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Experience Management</h1>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <Card>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {experiences?.map(exp => (
                <li key={exp.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{exp.position} at {exp.company}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => openModal(exp)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id, exp.position, exp.company)} disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">{experienceToEdit ? 'Edit Experience' : 'Add New Experience'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                <input type="text" name="company" id="company" defaultValue={experienceToEdit?.company} className="w-full input" required />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium mb-1">Position</label>
                <input type="text" name="position" id="position" defaultValue={experienceToEdit?.position} className="w-full input" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" id="description" rows={3} defaultValue={experienceToEdit?.description} className="w-full input" />
              </div>
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium mb-1">Technologies</label>
                <input type="text" name="technologies" id="technologies" defaultValue={experienceToEdit?.technologies} className="w-full input" placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" name="start_date" id="start_date" defaultValue={experienceToEdit?.start_date ? new Date(experienceToEdit.start_date).toISOString().split('T')[0] : ''} className="w-full input" required />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" name="end_date" id="end_date" defaultValue={experienceToEdit?.end_date ? new Date(experienceToEdit.end_date).toISOString().split('T')[0] : ''} className="w-full input" />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                <input type="text" name="location" id="location" defaultValue={experienceToEdit?.location} className="w-full input" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="current" id="current" defaultChecked={experienceToEdit?.current} className="mr-2" />
                <label htmlFor="current" className="text-sm">Currently working here</label>
              </div>
              <div>
                <label htmlFor="order_index" className="block text-sm font-medium mb-1">Order Index</label>
                <input type="number" name="order_index" id="order_index" defaultValue={experienceToEdit?.order_index} className="w-full input" required />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;
