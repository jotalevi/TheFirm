import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { companyService } from '@/services/api';

interface CompanyDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  onEdit: () => void;
}

interface CompanyData {
  id: number;
  companyName: string;
  companyRun: string;
  contactRut: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  contactDirStreet1: string;
  contactDirStreet2?: string;
  contactDirStNumber: string;
}

export default function CompanyDetails({
  isOpen,
  onClose,
  companyId,
  onEdit,
}: CompanyDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [company, setCompany] = useState<CompanyData | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      if (companyId && isOpen) {
        try {
          setLoading(true);
          setError('');
          const data = await companyService.getById(companyId);
          setCompany(data);
        } catch (err) {
          setError('Error al cargar los datos de la empresa');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCompany();
  }, [companyId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Empresa</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Cargando...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : company ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre de la Empresa</h3>
              <p className="mt-1">{company.companyName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">RUN Empresa</h3>
              <p className="mt-1">{company.companyRun}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">RUT Contacto</h3>
              <p className="mt-1">{company.contactRut}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre Completo</h3>
              <p className="mt-1">{company.contactName} {company.contactSurname}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email de Contacto</h3>
              <p className="mt-1">{company.contactEmail}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Teléfono de Contacto</h3>
              <p className="mt-1">{company.contactPhone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
              <p className="mt-1">{company.contactDirStreet1} {company.contactDirStNumber}</p>
              {company.contactDirStreet2 && <p className="mt-1">{company.contactDirStreet2}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={onClose}
                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </Button>
              <Button onClick={onEdit}>
                Editar
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">No se encontró la empresa</div>
        )}
      </DialogContent>
    </Dialog>
  );
} 