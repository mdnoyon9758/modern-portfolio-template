import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '../../services/portfolioApi';
import { Skill } from '../../types/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SkillsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: () => skillsApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (skillData: Omit<Skill, 'id' | 'created_at'>) => skillsApi.create(skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, skillData }: { id: number; skillData: Partial<Skill> }) => skillsApi.update(id, skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'skills'] });
    },
  });

  const openModal = (skill: Skill | null = null) => {
    setSkillToEdit(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSkillToEdit(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const skillData = {
      ...data,
      proficiency: Number(data.proficiency),
      order_index: Number(data.order_index)
    } as Omit<Skill, 'id' | 'created_at'>;

    if (skillToEdit) {
      updateMutation.mutate({ id: skillToEdit.id, skillData });
    } else {
      createMutation.mutate(skillData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills Management</h1>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <Card>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {skills?.map(skill => (
                <li key={skill.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{skill.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Proficiency: {skill.proficiency}%</span>
                    <span className="text-sm text-gray-500">Order: {skill.order_index}</span>
                    <Button variant="ghost" size="sm" onClick={() => openModal(skill)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id, skill.name)} disabled={deleteMutation.isPending}>
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
            <h2 className="text-2xl font-bold mb-6">{skillToEdit ? 'Edit Skill' : 'Add New Skill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Skill Name</label>
                <input type="text" name="name" id="name" defaultValue={skillToEdit?.name} className="w-full input" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <input type="text" name="category" id="category" defaultValue={skillToEdit?.category} className="w-full input" required />
              </div>
              <div>
                <label htmlFor="proficiency" className="block text-sm font-medium mb-1">Proficiency (%)</label>
                <input type="number" name="proficiency" id="proficiency" defaultValue={skillToEdit?.proficiency} className="w-full input" min="0" max="100" required />
              </div>
              <div>
                <label htmlFor="order_index" className="block text-sm font-medium mb-1">Order Index</label>
                <input type="number" name="order_index" id="order_index" defaultValue={skillToEdit?.order_index} className="w-full input" required />
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

export default SkillsManagement;

