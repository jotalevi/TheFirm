"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';

export default function UsersPage() {
  // Datos de ejemplo
  const users = [
    { 
      run: '12345678-9', 
      firstName: 'Juan', 
      lastName: 'Pérez', 
      email: 'juan.perez@example.com', 
      phone: '+56 9 1234 5678', 
      notify: true,
      isAdmin: false
    },
    { 
      run: '98765432-1', 
      firstName: 'María', 
      lastName: 'González', 
      email: 'maria.gonzalez@example.com', 
      phone: '+56 9 8765 4321', 
      notify: false,
      isAdmin: true
    },
    { 
      run: '45678912-3', 
      firstName: 'Carlos', 
      lastName: 'Rodríguez', 
      email: 'carlos.rodriguez@example.com', 
      phone: '+56 9 4567 8912', 
      notify: true,
      isAdmin: false
    },
    { 
      run: '78912345-6', 
      firstName: 'Ana', 
      lastName: 'Martínez', 
      email: 'ana.martinez@example.com', 
      phone: '+56 9 7891 2345', 
      notify: true,
      isAdmin: true
    },
    { 
      run: '23456789-0', 
      firstName: 'Pedro', 
      lastName: 'López', 
      email: 'pedro.lopez@example.com', 
      phone: '+56 9 2345 6789', 
      notify: false,
      isAdmin: false
    },
  ];

  return (
    <DashboardLayout title="Gestión de Usuarios">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <Button>Crear Usuario</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Buscar usuarios..."
              />
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos</option>
                <option value="admins">Administradores</option>
                <option value="regular">Regulares</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Notificaciones</option>
                <option value="enabled">Habilitadas</option>
                <option value="disabled">Deshabilitadas</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RUN</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Notificaciones</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.run}>
                  <TableCell>{user.run}</TableCell>
                  <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.notify ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.notify ? 'Activadas' : 'Desactivadas'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isAdmin ? 'Administrador' : 'Usuario'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Mostrando 5 de 894 usuarios
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 