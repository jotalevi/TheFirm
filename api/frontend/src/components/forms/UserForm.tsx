"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

// Interfaz simplificada para el formulario
interface UserFormData {
  run: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notify: boolean;
  isAdmin: boolean;
}

// Esquema de validación
const userSchema = yup.object().shape({
  run: yup.string().required('RUN es requerido'),
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  phone: yup.string().required('Teléfono es requerido'),
  notify: yup.boolean().default(false).required(),
  isAdmin: yup.boolean().default(false).required()
});

interface UserFormProps {
  user?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, isLoading = false }) => {
  const defaultValues: UserFormData = {
    run: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notify: false,
    isAdmin: false,
    ...user
  };

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: yupResolver(userSchema) as any,
    defaultValues
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Editar Usuario' : 'Crear Usuario'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="run" className="text-sm font-medium">RUN</label>
            <Input
              id="run"
              placeholder="12345678-9"
              {...register('run')}
              disabled={!!user}
            />
            {errors.run && <p className="text-destructive text-sm">{errors.run.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">Nombre</label>
              <Input
                id="firstName"
                placeholder="Nombre"
                {...register('firstName')}
              />
              {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">Apellido</label>
              <Input
                id="lastName"
                placeholder="Apellido"
                {...register('lastName')}
              />
              {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              {...register('email')}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
            <Input
              id="phone"
              placeholder="+56 9 1234 5678"
              {...register('phone')}
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notify"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('notify')}
            />
            <label htmlFor="notify" className="text-sm font-medium">
              Recibir notificaciones
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('isAdmin')}
            />
            <label htmlFor="isAdmin" className="text-sm font-medium">
              Es administrador
            </label>
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

export default UserForm; 