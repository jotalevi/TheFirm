"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { eventService } from '@/services/api';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: number;
  slug: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  logoIrid?: string;
  bannerIrid?: string;
  templateIrid?: string;
  cssIrid?: string;
  public: boolean;
  companyId: number;
  companyName: string;
}

export default function CalendarUserPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = parseISO(event.endDate);
      
      // Verificar si la fecha está dentro del rango del evento
      return isSameDay(date, eventStartDate) || 
             isSameDay(date, eventEndDate) || 
             (date > eventStartDate && date < eventEndDate);
    });
  };

  // Obtener eventos para el día seleccionado
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Generar días del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obtener días del mes anterior para completar la primera semana
  const firstDayOfWeek = monthStart.getDay();
  const daysFromPreviousMonth = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(monthStart);
    day.setDate(day.getDate() - i - 1);
    daysFromPreviousMonth.push(day);
  }

  // Obtener días del mes siguiente para completar la última semana
  const lastDayOfWeek = monthEnd.getDay();
  const daysFromNextMonth = [];
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    const day = new Date(monthEnd);
    day.setDate(day.getDate() + i);
    daysFromNextMonth.push(day);
  }

  const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const isCurrentMonth = (date: Date) => {
    return isSameMonth(date, currentDate);
  };

  const getEventCount = (date: Date) => {
    return getEventsForDate(date).length;
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            <div className="text-center">
              <CalendarIcon className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
              <p>Cargando calendario...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendario de Eventos</h1>
          <Button onClick={goToToday} variant="outline">
            Hoy
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Header del calendario */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Button onClick={goToPreviousMonth} variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold">
                      {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <Button onClick={goToNextMonth} variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-1">
                  {allDays.map((day, index) => {
                    const eventCount = getEventCount(day);
                    const hasEvents = eventCount > 0;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative h-16 p-2 text-left border rounded-lg transition-colors
                          ${isCurrentMonth(day) ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400'}
                          ${isToday(day) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                          ${isSelected(day) ? 'border-primary bg-primary/10' : ''}
                          ${!isCurrentMonth(day) ? 'cursor-default' : 'cursor-pointer'}
                        `}
                        disabled={!isCurrentMonth(day)}
                      >
                        <span className={`
                          text-sm font-medium
                          ${isToday(day) ? 'text-blue-600' : ''}
                          ${isSelected(day) ? 'text-primary' : ''}
                        `}>
                          {format(day, 'd')}
                        </span>
                        
                        {/* Badge para eventos */}
                        {hasEvents && (
                          <div className="absolute -top-1 -right-1">
                            <div className={`
                              flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white
                              ${eventCount > 1 ? 'bg-orange-500' : 'bg-green-500'}
                            `}>
                              {eventCount > 9 ? '9+' : eventCount}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de eventos del día seleccionado */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate ? (
                    <>
                      Eventos del {format(selectedDate, 'EEEE, d \'de\' MMMM', { locale: es })}
                    </>
                  ) : (
                    'Selecciona una fecha'
                  )}
                </h3>

                {selectedDate ? (
                  selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <h4 className="font-medium text-primary mb-1">{event.eventName}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.companyName}</p>
                          <p className="text-sm text-gray-500 mb-3">
                            {format(parseISO(event.startDate), 'HH:mm')} - {format(parseISO(event.endDate), 'HH:mm')}
                          </p>
                          {event.eventDescription && (
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {event.eventDescription}
                            </p>
                          )}
                          <div className="mt-3">
                            <Button size="sm" variant="outline" className="w-full">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay eventos para este día</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Selecciona una fecha para ver los eventos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 