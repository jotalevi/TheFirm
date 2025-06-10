import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { companyService } from '@/services/api';

interface CompanyFormProps {
  companyId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CompanyFormData {
  companyName: string;
  companyRun: string;
  contactRut: string;
  contactName: string;
  contactSurname: string;
  contactEmail: string;
  contactPhone: string;
  contactDirStreet1: string;
  contactDirStNumber: string;
}

export default function CompanyForm({ companyId, onSuccess, onCancel }: CompanyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    companyRun: '',
    contactRut: '',
    contactName: '',
    contactSurname: '',
    contactEmail: '',
    contactPhone: '',
    contactDirStreet1: '',
    contactDirStNumber: ''
  });

  useEffect(() => {
    const loadCompany = async () => {
      if (companyId) {
        try {
          setLoading(true);
          const data = await companyService.getById(companyId);
          setFormData({
            companyName: data.companyName,
            companyRun: data.companyRun,
            contactRut: data.contactRut,
            contactName: data.contactName,
            contactSurname: data.contactSurname,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            contactDirStreet1: data.contactDirStreet1,
            contactDirStNumber: data.contactDirStNumber
          });
        } catch (err) {
          setError('Error al cargar los datos de la empresa');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCompany();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      if (companyId) {
        await companyService.update(companyId, formData);
      } else {
        await companyService.create(formData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar la empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nombre de la Empresa</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Nombre de la empresa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyRun">RUN Empresa</Label>
        <Input
          id="companyRun"
          name="companyRun"
          value={formData.companyRun}
          onChange={handleChange}
          placeholder="XX.XXX.XXX-X"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactRut">RUT Contacto</Label>
        <Input
          id="contactRut"
          name="contactRut"
          value={formData.contactRut}
          onChange={handleChange}
          placeholder="XX.XXX.XXX-X"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactName">Nombre de Contacto</Label>
        <Input
          id="contactName"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          placeholder="Nombre del contacto"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactSurname">Apellido de Contacto</Label>
        <Input
          id="contactSurname"
          name="contactSurname"
          value={formData.contactSurname}
          onChange={handleChange}
          placeholder="Apellido del contacto"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email de Contacto</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="email@ejemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
        <Input
          id="contactPhone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder="+56 9 XXXX XXXX"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactDirStreet1">Dirección</Label>
        <Input
          id="contactDirStreet1"
          name="contactDirStreet1"
          value={formData.contactDirStreet1}
          onChange={handleChange}
          placeholder="Calle"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactDirStNumber">Número</Label>
        <Input
          id="contactDirStNumber"
          name="contactDirStNumber"
          value={formData.contactDirStNumber}
          onChange={handleChange}
          placeholder="Número de calle"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : companyId ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
} 