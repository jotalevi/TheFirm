"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';

export default function TicketsPage() {
  // Datos de ejemplo
  const ticketTiers = [
    { 
      id: 1,
      name: 'VIP',
      eventName: 'Conferencia de Tecnología 2024',
      eventDate: '2024-08-15',
      price: 150000,
      available: 50,
      sold: 30
    },
    { 
      id: 2,
      name: 'General',
      eventName: 'Conferencia de Tecnología 2024',
      eventDate: '2024-08-15',
      price: 50000,
      available: 200,
      sold: 120
    },
    { 
      id: 3,
      name: 'Premium',
      eventName: 'Festival de Música Santiago',
      eventDate: '2024-10-12',
      price: 85000,
      available: 100,
      sold: 75
    },
    { 
      id: 4,
      name: 'General',
      eventName: 'Festival de Música Santiago',
      eventDate: '2024-10-12',
      price: 45000,
      available: 500,
      sold: 375
    },
    { 
      id: 5,
      name: 'Entrada',
      eventName: 'Exposición de Arte Contemporáneo',
      eventDate: '2024-11-03',
      price: 15000,
      available: 300,
      sold: 150
    },
  ];

  return (
    <DashboardLayout title="Gestión de Tickets">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Categorías de Tickets</h2>
        <Button>Crear Categoría</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Buscar categorías..."
              />
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos los eventos</option>
                <option value="tech">Conferencia de Tecnología 2024</option>
                <option value="festival">Festival de Música Santiago</option>
                <option value="expo">Exposición de Arte</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Disponibles</TableHead>
                <TableHead>Vendidos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketTiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>{tier.eventName}</TableCell>
                  <TableCell>{tier.eventDate}</TableCell>
                  <TableCell>${tier.price.toLocaleString()}</TableCell>
                  <TableCell>{tier.available}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{tier.sold}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(tier.sold / (tier.available + tier.sold)) * 100}%` }}
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
              Mostrando 5 de 15 categorías
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