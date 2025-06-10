"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';

export default function EventsPage() {
  // Datos de ejemplo
  const events = [
    { 
      id: 1,
      name: 'Conferencia de Tecnología 2024',
      company: 'Tech Solutions',
      startDate: '2024-08-15',
      endDate: '2024-08-17',
      isPublic: true,
      tickets: 450,
      ticketsSold: 320
    },
    { 
      id: 2,
      name: 'Workshop de Marketing Digital',
      company: 'Empresa ABC',
      startDate: '2024-07-20',
      endDate: '2024-07-20',
      isPublic: false,
      tickets: 100,
      ticketsSold: 45
    },
    { 
      id: 3,
      name: 'Seminario de Liderazgo',
      company: 'Corporación XYZ',
      startDate: '2024-09-05',
      endDate: '2024-09-06',
      isPublic: true,
      tickets: 200,
      ticketsSold: 78
    },
    { 
      id: 4,
      name: 'Festival de Música Santiago',
      company: 'Global Services',
      startDate: '2024-10-12',
      endDate: '2024-10-14',
      isPublic: true,
      tickets: 1000,
      ticketsSold: 750
    },
    { 
      id: 5,
      name: 'Exposición de Arte Contemporáneo',
      company: 'Industrias 123',
      startDate: '2024-11-03',
      endDate: '2024-11-10',
      isPublic: true,
      tickets: 500,
      ticketsSold: 210
    },
  ];

  return (
    <DashboardLayout title="Gestión de Eventos">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Eventos</h2>
        <Button>Crear Evento</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Buscar eventos..."
              />
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todas las empresas</option>
                <option value="tech">Tech Solutions</option>
                <option value="abc">Empresa ABC</option>
                <option value="xyz">Corporación XYZ</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Visibilidad</option>
                <option value="public">Públicos</option>
                <option value="private">Privados</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Visibilidad</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.company}</TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.endDate}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      event.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isPublic ? 'Público' : 'Privado'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{event.ticketsSold}/{event.tickets}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(event.ticketsSold / event.tickets) * 100}%` }}
                        ></div>
                      </div>
                    </div>
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
              Mostrando 5 de 24 eventos
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