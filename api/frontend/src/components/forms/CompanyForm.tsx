"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

// Interfaz simplificada para el formulario
interface CompanyFormData {
  name: string;
  run: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

// Esquema de validación
const companySchema = yup.object().shape({
  name: yup.string().required('Nombre es requerido'),
  run: yup.string().required('RUN es requerido'),
  contactName: yup.string().required('Nombre de contacto es requerido'),
  contactEmail: yup.string().email('Email inválido').required('Email de contacto es requerido'),
  contactPhone: yup.string().required('Teléfono de contacto es requerido'),
});

interface CompanyFormProps {
  company?: CompanyFormData;
  onSubmit: (data: CompanyFormData) => void;
  isLoading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSubmit, isLoading = false }) => {
  const defaultValues: CompanyFormData = {
    name: '',
    run: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    ...company
  };

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema) as any,
    defaultValues
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{company ? 'Editar Empresa' : 'Crear Empresa'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nombre de Empresa</label>
            <Input
              id="name"
              placeholder="Nombre de la empresa"
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="run" className="text-sm font-medium">RUN</label>
            <Input
              id="run"
              placeholder="76.543.210-K"
              {...register('run')}
            />
            {errors.run && <p className="text-destructive text-sm">{errors.run.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="contactName" className="text-sm font-medium">Nombre de Contacto</label>
            <Input
              id="contactName"
              placeholder="Nombre de la persona de contacto"
              {...register('contactName')}
            />
            {errors.contactName && <p className="text-destructive text-sm">{errors.contactName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-sm font-medium">Email de Contacto</label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contacto@empresa.com"
              {...register('contactEmail')}
            />
            {errors.contactEmail && <p className="text-destructive text-sm">{errors.contactEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="contactPhone" className="text-sm font-medium">Teléfono de Contacto</label>
            <Input
              id="contactPhone"
              placeholder="+56 9 1234 5678"
              {...register('contactPhone')}
            />
            {errors.contactPhone && <p className="text-destructive text-sm">{errors.contactPhone.message}</p>}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyForm; 