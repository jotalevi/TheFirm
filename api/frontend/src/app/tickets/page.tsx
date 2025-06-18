"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ticketService } from '@/services/api';
import { eventService } from '@/services/api';
import TicketModal from '@/components/forms/TicketModal';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface TicketTier {
  id: number;
  tierName: string;
  basePrice: number;
  entryAllowedFrom?: string;
  entryAllowedTo?: string;
  singleUse: boolean;
  singleDaily: boolean;
  tierPdfTemplateIrid?: string;
  tierMailTemplateIrid?: string;
  stockInitial: number;
  stockCurrent: number;
  stockSold: number;
  eventId: number;
  eventName: string;
}

interface Event {
  id: number;
  slug: string;
  eventName: string;
  companyName: string;
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketTier[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadTickets(selectedEvent);
    } else {
      setTickets([]);
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
      if (eventsData.length > 0) {
        setSelectedEvent(eventsData[0].slug);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async (eventSlug: string) => {
    try {
      setLoading(true);
      const ticketsData = await ticketService.getTiersByEvent(eventSlug);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData: any) => {
    try {
      await ticketService.createTier(selectedEvent, ticketData);
      loadTickets(selectedEvent);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdateTicket = async (ticketData: any) => {
    if (!selectedTicket) return;
    try {
      await ticketService.updateTier(selectedEvent, selectedTicket.id, ticketData);
      loadTickets(selectedEvent);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    try {
      await ticketService.deleteTier(selectedEvent, selectedTicket.id);
      loadTickets(selectedEvent);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.tierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageTickets = user?.isAdmin || (user?.companiesModerated && user.companiesModerated.length > 0);

  if (!canManageTickets) {
    return (
      <DashboardLayout title="Gestión de Tickets">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                No tienes permisos para gestionar tickets.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Tickets">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Tickets</h1>
          {selectedEvent && (
            <TicketModal
              mode="create"
              eventSlug={selectedEvent}
              onSave={handleCreateTicket}
            >
              <Button>Crear Nuevo Tier</Button>
            </TicketModal>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por Evento</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccionar evento</option>
              {events.map((event) => (
                <option key={event.slug} value={event.slug}>
                  {event.eventName} - {event.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center">Cargando tickets...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{ticket.tierName}</CardTitle>
                  <p className="text-sm text-gray-600">{ticket.eventName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Precio:</span>
                      <span>${ticket.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stock Inicial:</span>
                      <span>{ticket.stockInitial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stock Actual:</span>
                      <span>{ticket.stockCurrent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Vendidos:</span>
                      <span>{ticket.stockSold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Uso Único:</span>
                      <span>{ticket.singleUse ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Uso Diario:</span>
                      <span>{ticket.singleDaily ? 'Sí' : 'No'}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <TicketModal
                      mode="view"
                      ticket={ticket}
                      eventSlug={selectedEvent}
                    >
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </TicketModal>

                    <TicketModal
                      mode="edit"
                      ticket={ticket}
                      eventSlug={selectedEvent}
                      onSave={handleUpdateTicket}
                      onDelete={handleDeleteTicket}
                    >
                      <Button size="sm">
                        Editar
                      </Button>
                    </TicketModal>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTickets.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                {selectedEvent ? 'No se encontraron tickets para este evento.' : 'Selecciona un evento para ver sus tickets.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 