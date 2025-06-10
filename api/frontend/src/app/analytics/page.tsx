"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default function AnalyticsPage() {
  // Datos de ejemplo para las estadísticas
  const stats = [
    { title: 'Eventos Totales', value: '24', change: '+12%' },
    { title: 'Tickets Vendidos', value: '2,453', change: '+18%' },
    { title: 'Ingresos', value: '$123,456', change: '+15%' },
    { title: 'Tasa de Conversión', value: '3.2%', change: '+0.8%' },
  ];

  // Datos de ejemplo para el gráfico de ventas mensuales
  const monthlyData = [
    { month: 'Ene', tickets: 120, revenue: 12000 },
    { month: 'Feb', tickets: 145, revenue: 14500 },
    { month: 'Mar', tickets: 210, revenue: 21000 },
    { month: 'Abr', tickets: 198, revenue: 19800 },
    { month: 'May', tickets: 245, revenue: 24500 },
    { month: 'Jun', tickets: 370, revenue: 37000 },
  ];

  // Datos de ejemplo para las fuentes de tráfico
  const trafficSources = [
    { source: 'Búsqueda Orgánica', sessions: 4500, percentage: 45 },
    { source: 'Redes Sociales', sessions: 2800, percentage: 28 },
    { source: 'Referidos', sessions: 1500, percentage: 15 },
    { source: 'Directo', sessions: 800, percentage: 8 },
    { source: 'Otros', sessions: 400, percentage: 4 },
  ];

  // Datos de ejemplo para eventos populares
  const popularEvents = [
    { name: 'Conferencia de Tecnología 2024', views: 3200, tickets: 120, conversion: 3.75 },
    { name: 'Festival de Música Santiago', views: 2800, tickets: 230, conversion: 8.21 },
    { name: 'Workshop de Marketing Digital', views: 1700, tickets: 45, conversion: 2.65 },
    { name: 'Seminario de Liderazgo', views: 1500, tickets: 78, conversion: 5.20 },
    { name: 'Exposición de Arte Contemporáneo', views: 1200, tickets: 65, conversion: 5.42 },
  ];

  return (
    <DashboardLayout title="Analíticas">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">{stat.title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full bg-muted/10 flex items-center justify-center">
              <p className="text-muted-foreground">Aquí iría un gráfico de ventas mensuales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Tráfico</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Sesiones</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficSources.map((source, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell>{source.sessions.toLocaleString()}</TableCell>
                    <TableCell>{source.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Vistas</TableHead>
                <TableHead>Tickets Vendidos</TableHead>
                <TableHead>Tasa de Conversión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.views.toLocaleString()}</TableCell>
                  <TableCell>{event.tickets}</TableCell>
                  <TableCell>{event.conversion}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 