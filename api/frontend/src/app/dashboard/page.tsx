"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default function DashboardPage() {
  // Este es un ejemplo de datos, normalmente se obtendrían de una API
  const recentEvents = [
    { id: 1, name: 'Conferencia de Tecnología 2024', date: '2024-08-15', tickets: 120 },
    { id: 2, name: 'Workshop de Marketing Digital', date: '2024-07-20', tickets: 45 },
    { id: 3, name: 'Seminario de Liderazgo', date: '2024-09-05', tickets: 78 },
  ];

  const stats = [
    { title: 'Eventos Activos', value: '12' },
    { title: 'Tickets Vendidos', value: '1,245' },
    { title: 'Usuarios Registrados', value: '894' },
    { title: 'Empresas', value: '38' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="text-center p-6">
                <p className="text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.tickets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    U
                  </div>
                  <div>
                    <p className="font-medium">Nuevo usuario registrado</p>
                    <p className="text-sm text-muted-foreground">Juan Pérez se registró hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    T
                  </div>
                  <div>
                    <p className="font-medium">Venta de tickets</p>
                    <p className="text-sm text-muted-foreground">Se vendieron 5 tickets para Conferencia de Tecnología</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    E
                  </div>
                  <div>
                    <p className="font-medium">Nuevo evento creado</p>
                    <p className="text-sm text-muted-foreground">Workshop de Marketing Digital creado por Empresa XYZ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 