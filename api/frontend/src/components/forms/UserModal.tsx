"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { userService, userRoleService, companyService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  run: string;
  firstNames: string;
  lastNames: string;
  email: string;
  phone: string;
  dirStates?: number;
  dirCounty?: number;
  dirStreet1: string;
  dirStreet2?: string;
  dirStNumber: string;
  dirInNumber?: string;
  notify: boolean;
  isAdmin: boolean;
  companiesModerated?: number[];
}

interface Company {
  id: number;
  companyName: string;
}

interface UserModalProps {
  mode: 'create' | 'edit' | 'view';
  user?: User;
  onSave?: (user: User) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

const initialErrors = {
  firstNames: '',
  lastNames: '',
  email: '',
  phone: '',
  dirStreet1: '',
  dirStNumber: '',
};

export default function UserModal({ 
  mode, 
  user, 
  onSave, 
  onDelete, 
  children 
}: UserModalProps) {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    run: '',
    firstNames: '',
    lastNames: '',
    email: '',
    phone: '',
    dirStreet1: '',
    dirStreet2: '',
    dirStNumber: '',
    dirInNumber: '',
    notify: false,
    isAdmin: false
  });
  const [errors, setErrors] = useState<{[key:string]: string}>(initialErrors);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userCompaniesModerated, setUserCompaniesModerated] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (user && mode !== 'create') {
        loadUserCompaniesModerated(user.run);
      }
    }
  }, [isOpen, user, mode]);

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        ...user,
        dirStreet2: user.dirStreet2 || '',
        dirInNumber: user.dirInNumber || ''
      });
      setErrors(initialErrors);
    } else if (mode === 'create') {
      setFormData({
        run: '',
        firstNames: '',
        lastNames: '',
        email: '',
        phone: '',
        dirStreet1: '',
        dirStreet2: '',
        dirStNumber: '',
        dirInNumber: '',
        notify: false,
        isAdmin: false
      });
      setErrors(initialErrors);
    }
  }, [user, mode]);

  const loadCompanies = async () => {
    try {
      const companiesData = await companyService.getAll();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadUserCompaniesModerated = async (userRun: string) => {
    try {
      const companiesModerated = await userRoleService.getUserCompaniesModerated(userRun);
      setUserCompaniesModerated(companiesModerated);
    } catch (error) {
      console.error('Error loading user companies moderated:', error);
      setUserCompaniesModerated([]);
    }
  };

  const validate = () => {
    const newErrors: {[key:string]: string} = {...initialErrors};
    if (!formData.firstNames) newErrors.firstNames = 'Los nombres son requeridos';
    if (!formData.lastNames) newErrors.lastNames = 'Los apellidos son requeridos';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    if (!formData.dirStreet1) newErrors.dirStreet1 = 'La calle es requerida';
    if (!formData.dirStNumber) newErrors.dirStNumber = 'El número de calle es requerido';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSave) {
      onSave(formData);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsOpen(false);
    }
  };

  const handleSetAdmin = async (isAdmin: boolean) => {
    if (!user) return;
    setLoading(true);
    try {
      await userRoleService.setUserAdmin(user.run, isAdmin);
      setFormData({ ...formData, isAdmin });
    } catch (error) {
      console.error('Error setting admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompanyModeration = async (companyId: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const isCurrentlyModerator = userCompaniesModerated.includes(companyId);
      if (isCurrentlyModerator) {
        await userRoleService.removeUserFromCompanyModeration(user.run, companyId);
        setUserCompaniesModerated(prev => prev.filter(id => id !== companyId));
      } else {
        await userRoleService.addUserToCompanyModeration(user.run, companyId);
        setUserCompaniesModerated(prev => [...prev, companyId]);
      }
    } catch (error) {
      console.error('Error toggling company moderation:', error);
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === 'view';
  const canManageRoles = currentUser?.isAdmin || (currentUser?.companiesModerated && currentUser.companiesModerated.length > 0);

  const inputClass = (field: string) =>
    `w-full ${errors[field] ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {mode === 'create' && 'Crear Usuario'}
                {mode === 'edit' && 'Editar Usuario'}
                {mode === 'view' && 'Ver Usuario'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">RUN</label>
                    <Input
                      type="text"
                      value={formData.run}
                      onChange={(e) => setFormData({...formData, run: e.target.value})}
                      disabled={mode !== 'create'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      className={inputClass('email')}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombres <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      className={inputClass('firstNames')}
                      value={formData.firstNames}
                      onChange={(e) => setFormData({...formData, firstNames: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                    {errors.firstNames && <p className="text-red-500 text-xs mt-1">{errors.firstNames}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellidos <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      className={inputClass('lastNames')}
                      value={formData.lastNames}
                      onChange={(e) => setFormData({...formData, lastNames: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                    {errors.lastNames && <p className="text-red-500 text-xs mt-1">{errors.lastNames}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    className={inputClass('phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Calle <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      className={inputClass('dirStreet1')}
                      value={formData.dirStreet1}
                      onChange={(e) => setFormData({...formData, dirStreet1: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                    {errors.dirStreet1 && <p className="text-red-500 text-xs mt-1">{errors.dirStreet1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      className={inputClass('dirStNumber')}
                      value={formData.dirStNumber}
                      onChange={(e) => setFormData({...formData, dirStNumber: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                    {errors.dirStNumber && <p className="text-red-500 text-xs mt-1">{errors.dirStNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Calle 2</label>
                    <Input
                      type="text"
                      value={formData.dirStreet2}
                      onChange={(e) => setFormData({...formData, dirStreet2: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número Interior</label>
                    <Input
                      type="text"
                      value={formData.dirInNumber}
                      onChange={(e) => setFormData({...formData, dirInNumber: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.notify}
                      onChange={(e) => setFormData({...formData, notify: e.target.checked})}
                      disabled={isViewMode}
                    />
                    <span className="text-sm font-medium">Recibir notificaciones</span>
                  </label>
                </div>

                {/* Gestión de Roles */}
                {canManageRoles && mode !== 'create' && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Gestión de Roles</h3>
                    
                    {/* Admin Status */}
                    {currentUser?.isAdmin && (
                      <div className="mb-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.isAdmin}
                            onChange={(e) => handleSetAdmin(e.target.checked)}
                            disabled={loading || isViewMode}
                          />
                          <span className="text-sm font-medium">Es Administrador</span>
                        </label>
                      </div>
                    )}

                    {/* Company Moderation */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Moderación de Empresas</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {companies.map((company) => {
                          const isModerator = userCompaniesModerated.includes(company.id);
                          const canManageThisCompany = currentUser?.isAdmin || 
                            (currentUser?.companiesModerated && currentUser.companiesModerated.includes(company.id));
                          
                          return (
                            <div key={company.id} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{company.companyName}</span>
                              {canManageThisCompany ? (
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isModerator}
                                    onChange={() => handleToggleCompanyModeration(company.id)}
                                    disabled={loading || isViewMode}
                                  />
                                  <span className="text-xs">Moderador</span>
                                </label>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  {isModerator ? 'Moderador' : 'No moderador'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  
                  {mode === 'edit' && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Eliminar
                    </Button>
                  )}
                  
                  {!isViewMode && (
                    <Button type="submit" disabled={loading}>
                      {mode === 'create' ? 'Crear' : 'Guardar'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 