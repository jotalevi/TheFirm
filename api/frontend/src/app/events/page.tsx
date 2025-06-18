"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import EventModal from '@/components/events/EventModal';
import { useAuth } from '@/contexts/AuthContext';
import { eventService, companyService } from '@/services/api';

interface Event {
  id?: number;
  slug: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  logoIrid: string;
  bannerIrid: string;
  templateIrid: string;
  cssIrid: string;
  public: boolean;
  companyId: number;
  companyName?: string;
}

interface Company {
  id: number;
  companyName: string;
}

export default function EventsPage() {
  const { isAdmin, isModerator, companiesModerated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar eventos según el rol
        let eventsData: Event[];
        if (isAdmin || isModerator) {
          eventsData = await eventService.getAllForAdmin();
        } else {
          eventsData = await eventService.getAll();
        }

        // Cargar empresas
        const companiesData = await companyService.getAll();
        
        setEvents(eventsData);
        setCompanies(companiesData.items || companiesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, isModerator]);

  // Filtrar eventos según rol y filtros
  const filteredEvents = events.filter(event => {
    // Filtro por rol: moderadores solo ven eventos de sus empresas
    if (isModerator && companiesModerated && !companiesModerated.includes(event.companyId)) {
      return false;
    }

    // Filtro por búsqueda
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por empresa
    const matchesCompany = !selectedCompany || event.companyName === selectedCompany;
    
    // Filtro por visibilidad
    const matchesVisibility = !selectedVisibility || 
      (selectedVisibility === 'public' && event.public) ||
      (selectedVisibility === 'private' && !event.public);
    
    return matchesSearch && matchesCompany && matchesVisibility;
  });

  const handleCreateEvent = async (eventData: Event) => {
    try {
      const newEvent = await eventService.create(eventData);
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento');
    }
  };

  const handleUpdateEvent = async (eventData: Event) => {
    try {
      const updatedEvent = await eventService.update(eventData.slug, eventData);
      const updatedEvents = events.map(event => 
        event.slug === eventData.slug ? updatedEvent : event
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error al actualizar el evento');
    }
  };

  const handleDeleteEvent = async (slug: string) => {
    try {
      await eventService.delete(slug);
      setEvents(events.filter(event => event.slug !== slug));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    }
  };

  const handleSave = (eventData: Event) => {
    if (eventData.slug && events.find(e => e.slug === eventData.slug)) {
      handleUpdateEvent(eventData);
    } else {
      handleCreateEvent(eventData);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Gestión de Eventos">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando eventos...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Eventos">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Eventos</h2>
        {(isAdmin || isModerator) && (
          <EventModal
            mode="create"
            companies={companies}
            onSave={handleSave}
          >
            <Button>Crear Evento</Button>
          </EventModal>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Todas las empresas</option>
                {companies.map(company => (
                  <option key={company.id} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </select>
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedVisibility}
                onChange={(e) => setSelectedVisibility(e.target.value)}
              >
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
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.eventName}</TableCell>
                  <TableCell>{event.companyName}</TableCell>
                  <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      event.public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.public ? 'Público' : 'Privado'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EventModal
                        mode="view"
                        event={event}
                        companies={companies}
                      >
                        <Button variant="outline" size="sm">Ver</Button>
                      </EventModal>
                      {(isAdmin || isModerator) && (
                        <EventModal
                          mode="edit"
                          event={event}
                          companies={companies}
                          onSave={handleSave}
                          onDelete={() => handleDeleteEvent(event.slug)}
                        >
                          <Button variant="outline" size="sm">Editar</Button>
                        </EventModal>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredEvents.length} de {events.length} eventos
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 