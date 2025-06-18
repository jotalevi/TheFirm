"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { userService, companyService, userRoleService } from '@/services/api';
import UserModal from '@/components/forms/UserModal';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
  companiesModerated?: number[]; // IDs de empresas que modera
}

interface Company {
  id: number;
  companyName: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | ''>('');

  useEffect(() => {
    loadUsers();
    if (currentUser?.isAdmin || (currentUser?.companiesModerated && currentUser.companiesModerated.length > 0)) {
      loadCompanies();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let usersData;
      
      if (selectedCompany && !currentUser?.isAdmin) {
        // Para moderadores: cargar usuarios de la empresa seleccionada
        usersData = await userService.getByCompany(selectedCompany);
      } else {
        // Para admins: cargar todos los usuarios
        usersData = await userService.getAll(1, 100, searchTerm);
      }
      
      // Obtener las empresas que modera cada usuario
      const usersWithModeration = await Promise.all(
        usersData.map(async (user: User) => {
          try {
            const moderatedCompanies = await userRoleService.getUserCompaniesModerated(user.run);
            return {
              ...user,
              companiesModerated: moderatedCompanies.map((company: any) => company.id)
            };
          } catch (error) {
            console.error(`Error getting moderated companies for user ${user.run}:`, error);
            return {
              ...user,
              companiesModerated: []
            };
          }
        })
      );
      
      setUsers(usersWithModeration);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Recargar usuarios cuando cambie la empresa seleccionada
  useEffect(() => {
    loadUsers();
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const companiesData = await companyService.getAll();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleCreateUser = async (userData: User) => {
    try {
      const mappedData = {
        run: userData.run,
        firstName: userData.firstNames,
        lastName: userData.lastNames,
        email: userData.email,
        phone: userData.phone,
        notify: userData.notify,
        isAdmin: userData.isAdmin
      };
      await userService.create(mappedData);
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userData: User) => {
    if (!selectedUser) return;
    try {
      const mappedData = {
        run: userData.run,
        firstName: userData.firstNames,
        lastName: userData.lastNames,
        email: userData.email,
        phone: userData.phone,
        notify: userData.notify,
        isAdmin: userData.isAdmin
      };
      await userService.update(selectedUser.run, mappedData);
      loadUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await userService.delete(selectedUser.run);
      loadUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.run.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageUsers = currentUser?.isAdmin || (currentUser?.companiesModerated && currentUser.companiesModerated.length > 0);

  if (!canManageUsers) {
    return (
      <DashboardLayout title="Gestión de Usuarios">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                No tienes permisos para gestionar usuarios.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Usuarios">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <UserModal
            mode="create"
            onSave={handleCreateUser}
          >
            <Button>Crear Nuevo Usuario</Button>
          </UserModal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <Input
              type="text"
              placeholder="Buscar por nombre, email o RUN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {!currentUser?.isAdmin && currentUser?.companiesModerated && currentUser.companiesModerated.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Filtrar por Empresa</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas las empresas</option>
                {companies
                  .filter(company => currentUser.companiesModerated?.includes(company.id))
                  .map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center">Cargando usuarios...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RUN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notificaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.run} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.firstNames.charAt(0)}{user.lastNames.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstNames} {user.lastNames}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.dirStreet1} {user.dirStNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.run}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.isAdmin && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Admin
                              </span>
                            )}
                            {user.companiesModerated && user.companiesModerated.length > 0 && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Moderator
                              </span>
                            )}
                            {!user.isAdmin && (!user.companiesModerated || user.companiesModerated.length === 0) && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Usuario
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.notify 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.notify ? 'Activadas' : 'Desactivadas'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <UserModal
                              mode="view"
                              user={user}
                            >
                              <Button variant="outline" size="sm">
                                Ver
                              </Button>
                            </UserModal>

                            <UserModal
                              mode="edit"
                              user={user}
                              onSave={handleUpdateUser}
                              onDelete={handleDeleteUser}
                            >
                              <Button size="sm">
                                Editar
                              </Button>
                            </UserModal>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                No se encontraron usuarios.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 