"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { companyService } from '@/services/api';
import CompanyModal from '@/components/forms/CompanyModal';

interface Company {
  id?: number;
  companyName: string;
  companyRun: string;
  logoIrid?: string;
  bannerIrid?: string;
  htmlIrid?: string;
  contactRut: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  contactDirStates?: number;
  contactDirCounty?: number;
  contactDirStreet1: string;
  contactDirStreet2?: string;
  contactDirStNumber: string;
  contactDirInNumber?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const companiesData = await companyService.getAll();
        // Mapear todos los campos requeridos
        const mapped = (companiesData.items || companiesData).map((c: any) => ({
          id: c.id,
          companyName: c.companyName || '',
          companyRun: c.companyRun || '',
          logoIrid: c.logoIrid || '',
          bannerIrid: c.bannerIrid || '',
          htmlIrid: c.htmlIrid || '',
          contactRut: c.contactRut || '',
          contactName: c.contactName || '',
          contactSurname: c.contactSurname || '',
          contactEmail: c.contactEmail || '',
          contactPhone: c.contactPhone || '',
          contactDirStates: c.contactDirStates,
          contactDirCounty: c.contactDirCounty,
          contactDirStreet1: c.contactDirStreet1 || '',
          contactDirStreet2: c.contactDirStreet2 || '',
          contactDirStNumber: c.contactDirStNumber || '',
          contactDirInNumber: c.contactDirInNumber || ''
        }));
        setCompanies(mapped);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar empresas por búsqueda
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleCreateCompany = async (companyData: Company) => {
    try {
      const newCompany = await companyService.create(companyData);
      setCompanies([...companies, newCompany]);
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error al crear la empresa');
    }
  };

  const handleUpdateCompany = async (companyData: Company) => {
    try {
      const updatedCompany = await companyService.update(companyData.id!, companyData);
      const updatedCompanies = companies.map(company => 
        company.id === companyData.id ? updatedCompany : company
      );
      setCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error al actualizar la empresa');
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      await companyService.delete(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Error al eliminar la empresa');
    }
  };

  const handleSave = (companyData: Company) => {
    if (companyData.id && companies.find(c => c.id === companyData.id)) {
      handleUpdateCompany(companyData);
    } else {
      handleCreateCompany(companyData);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Gestión de Empresas">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando empresas...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Empresas">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Empresas</h2>
        <CompanyModal
          mode="create"
          onSave={handleSave}
        >
          <Button>Crear Empresa</Button>
        </CompanyModal>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>RUN</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.companyName}</TableCell>
                  <TableCell>{company.companyRun}</TableCell>
                  <TableCell>{company.contactName}</TableCell>
                  <TableCell>{company.contactEmail}</TableCell>
                  <TableCell>{company.contactPhone}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <CompanyModal
                        mode="view"
                        company={company}
                      >
                        <Button variant="outline" size="sm">Ver</Button>
                      </CompanyModal>
                      <CompanyModal
                        mode="edit"
                        company={company}
                        onSave={handleSave}
                        onDelete={() => handleDeleteCompany(company.id!)}
                      >
                        <Button variant="outline" size="sm">Editar</Button>
                      </CompanyModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredCompanies.length} de {companies.length} empresas
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 