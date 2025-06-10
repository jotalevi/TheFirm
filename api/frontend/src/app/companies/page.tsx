"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { companyService } from '@/services/api';
import CompanyDialog from './CompanyDialog';
import CompanyDetails from './CompanyDetails';

interface Company {
  id: number;
  companyName: string;
  companyRun: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  eventsCount?: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // Estados para los diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined);

  const loadCompanies = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await companyService.getAll(page, pagination.pageSize, searchTerm);
      
      // Adaptar los datos para mostrar en la tabla
      const formattedCompanies = response.items.map((company: any) => ({
        id: company.id,
        companyName: company.companyName,
        companyRun: company.companyRun,
        contactName: company.contactName,
        contactSurname: company.contactSurname,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        eventsCount: 0 // Por defecto, podríamos obtener esto de una API adicional si es necesario
      }));
      
      setCompanies(formattedCompanies);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize: response.pageSize
      });
    } catch (err) {
      setError('Error al cargar las empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCompanies(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    // Aquí iría la lógica para filtrar por eventos si se implementa en el backend
  };

  const handlePageChange = (page: number) => {
    loadCompanies(page);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadCompanies();
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    loadCompanies();
  };

  const handleView = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setEditDialogOpen(true);
  };

  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  return (
    <DashboardLayout title="Gestión de Empresas">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Empresas</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>Crear Empresa</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <form onSubmit={handleSearchSubmit} className="w-64">
              <Input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
            <div className="flex gap-2">
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="">Todos los eventos</option>
                <option value="0">Sin eventos</option>
                <option value="1-5">1-5 eventos</option>
                <option value="6+">6+ eventos</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">Cargando empresas...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">{error}</div>
          ) : companies.length === 0 ? (
            <div className="py-20 text-center">No se encontraron empresas</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RUN</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Eventos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.companyName}</TableCell>
                      <TableCell>{company.companyRun}</TableCell>
                      <TableCell>{company.contactName} {company.contactSurname}</TableCell>
                      <TableCell>{company.contactEmail}</TableCell>
                      <TableCell>{company.contactPhone}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          (company.eventsCount || 0) > 5 ? 'bg-green-100 text-green-800' :
                          (company.eventsCount || 0) > 0 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {company.eventsCount || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            className="h-8 px-2 text-xs"
                            onClick={() => handleView(company.id)}
                          >
                            Ver
                          </Button>
                          <Button 
                            className="h-8 px-2 text-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={() => handleEdit(company.id)}
                          >
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Mostrando {companies.length} de {pagination.totalItems} empresas
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex gap-2">
                    <Button 
                      className="h-8 px-2 text-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1">...</span>
                          )}
                          <Button 
                            className={`h-8 w-8 p-0 text-xs ${
                              pagination.currentPage === page 
                                ? 'bg-primary text-primary-foreground' 
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                    <Button 
                      className="h-8 px-2 text-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <CompanyDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Crear Empresa"
        onSuccess={handleCreateSuccess}
      />

      {selectedCompanyId && (
        <>
          <CompanyDialog
            isOpen={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            companyId={selectedCompanyId}
            title="Editar Empresa"
            onSuccess={handleEditSuccess}
          />

          <CompanyDetails
            isOpen={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            companyId={selectedCompanyId}
            onEdit={handleEditFromDetails}
          />
        </>
      )}
    </DashboardLayout>
  );
} 