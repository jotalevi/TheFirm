"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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

interface CompanyModalProps {
  mode: 'create' | 'edit' | 'view';
  company?: Company;
  onSave?: (company: Company) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

const initialErrors = {
  companyName: '',
  companyRun: '',
  contactRut: '',
  contactName: '',
  contactSurname: '',
  contactEmail: '',
  contactPhone: '',
  contactDirStreet1: '',
  contactDirStNumber: '',
};

// Datos completos de regiones y comunas de Chile
const regiones = [
  {
    id: 15,
    nombre: 'Región de Arica y Parinacota',
    comunas: [
      { id: 15101, nombre: 'Arica' },
      { id: 15102, nombre: 'Camarones' },
      { id: 15201, nombre: 'Putre' },
      { id: 15202, nombre: 'General Lagos' }
    ]
  },
  {
    id: 1,
    nombre: 'Región de Tarapacá',
    comunas: [
      { id: 11101, nombre: 'Iquique' },
      { id: 11107, nombre: 'Alto Hospicio' },
      { id: 11401, nombre: 'Pozo Almonte' },
      { id: 11402, nombre: 'Camiña' },
      { id: 11403, nombre: 'Colchane' },
      { id: 11404, nombre: 'Huara' },
      { id: 11405, nombre: 'Pica' }
    ]
  },
  {
    id: 2,
    nombre: 'Región de Antofagasta',
    comunas: [
      { id: 21101, nombre: 'Antofagasta' },
      { id: 21102, nombre: 'Mejillones' },
      { id: 21103, nombre: 'Sierra Gorda' },
      { id: 21104, nombre: 'Taltal' },
      { id: 22101, nombre: 'Calama' },
      { id: 22102, nombre: 'Ollagüe' },
      { id: 22103, nombre: 'San Pedro de Atacama' },
      { id: 23101, nombre: 'Tocopilla' },
      { id: 23102, nombre: 'María Elena' }
    ]
  },
  {
    id: 3,
    nombre: 'Región de Atacama',
    comunas: [
      { id: 31101, nombre: 'Copiapó' },
      { id: 31102, nombre: 'Caldera' },
      { id: 31103, nombre: 'Tierra Amarilla' },
      { id: 32101, nombre: 'Chañaral' },
      { id: 32102, nombre: 'Diego de Almagro' },
      { id: 33101, nombre: 'Vallenar' },
      { id: 33102, nombre: 'Alto del Carmen' },
      { id: 33103, nombre: 'Freirina' },
      { id: 33104, nombre: 'Huasco' }
    ]
  },
  {
    id: 4,
    nombre: 'Región de Coquimbo',
    comunas: [
      { id: 41101, nombre: 'La Serena' },
      { id: 41102, nombre: 'Coquimbo' },
      { id: 41103, nombre: 'Andacollo' },
      { id: 41104, nombre: 'La Higuera' },
      { id: 41105, nombre: 'Paiguano' },
      { id: 41106, nombre: 'Vicuña' },
      { id: 42101, nombre: 'Illapel' },
      { id: 42102, nombre: 'Canela' },
      { id: 42103, nombre: 'Los Vilos' },
      { id: 42104, nombre: 'Salamanca' },
      { id: 43101, nombre: 'Ovalle' },
      { id: 43102, nombre: 'Combarbalá' },
      { id: 43103, nombre: 'Monte Patria' },
      { id: 43104, nombre: 'Punitaqui' },
      { id: 43105, nombre: 'Río Hurtado' }
    ]
  },
  {
    id: 5,
    nombre: 'Región de Valparaíso',
    comunas: [
      { id: 51101, nombre: 'Valparaíso' },
      { id: 51102, nombre: 'Casablanca' },
      { id: 51103, nombre: 'Concón' },
      { id: 51104, nombre: 'Juan Fernández' },
      { id: 51105, nombre: 'Puchuncaví' },
      { id: 51107, nombre: 'Quintero' },
      { id: 51109, nombre: 'Viña del Mar' },
      { id: 52101, nombre: 'Isla de Pascua' },
      { id: 53101, nombre: 'Los Andes' },
      { id: 53102, nombre: 'Calle Larga' },
      { id: 53103, nombre: 'Rinconada' },
      { id: 53104, nombre: 'San Esteban' },
      { id: 54101, nombre: 'La Ligua' },
      { id: 54102, nombre: 'Cabildo' },
      { id: 54103, nombre: 'Papudo' },
      { id: 54104, nombre: 'Petorca' },
      { id: 54105, nombre: 'Zapallar' },
      { id: 55101, nombre: 'Quillota' },
      { id: 55102, nombre: 'Calera' },
      { id: 55103, nombre: 'Hijuelas' },
      { id: 55104, nombre: 'La Cruz' },
      { id: 55106, nombre: 'Nogales' },
      { id: 56101, nombre: 'San Antonio' },
      { id: 56102, nombre: 'Algarrobo' },
      { id: 56103, nombre: 'Cartagena' },
      { id: 56104, nombre: 'El Quisco' },
      { id: 56105, nombre: 'El Tabo' },
      { id: 56106, nombre: 'Santo Domingo' },
      { id: 57101, nombre: 'San Felipe' },
      { id: 57102, nombre: 'Catemu' },
      { id: 57103, nombre: 'Llaillay' },
      { id: 57104, nombre: 'Panquehue' },
      { id: 57105, nombre: 'Putaendo' },
      { id: 57106, nombre: 'Santa María' },
      { id: 58101, nombre: 'Quilpué' },
      { id: 58102, nombre: 'Limache' },
      { id: 58103, nombre: 'Olmué' },
      { id: 58104, nombre: 'Villa Alemana' }
    ]
  },
  {
    id: 13,
    nombre: 'Región Metropolitana de Santiago',
    comunas: [
      { id: 13101, nombre: 'Santiago' },
      { id: 13102, nombre: 'Cerrillos' },
      { id: 13103, nombre: 'Cerro Navia' },
      { id: 13104, nombre: 'Conchalí' },
      { id: 13105, nombre: 'El Bosque' },
      { id: 13106, nombre: 'Estación Central' },
      { id: 13107, nombre: 'Huechuraba' },
      { id: 13108, nombre: 'Independencia' },
      { id: 13109, nombre: 'La Cisterna' },
      { id: 13110, nombre: 'La Florida' },
      { id: 13111, nombre: 'La Granja' },
      { id: 13112, nombre: 'La Pintana' },
      { id: 13113, nombre: 'La Reina' },
      { id: 13114, nombre: 'Las Condes' },
      { id: 13115, nombre: 'Lo Barnechea' },
      { id: 13116, nombre: 'Lo Espejo' },
      { id: 13117, nombre: 'Lo Prado' },
      { id: 13118, nombre: 'Macul' },
      { id: 13119, nombre: 'Maipú' },
      { id: 13120, nombre: 'Ñuñoa' },
      { id: 13121, nombre: 'Pedro Aguirre Cerda' },
      { id: 13122, nombre: 'Peñalolén' },
      { id: 13123, nombre: 'Providencia' },
      { id: 13124, nombre: 'Pudahuel' },
      { id: 13125, nombre: 'Quilicura' },
      { id: 13126, nombre: 'Quinta Normal' },
      { id: 13127, nombre: 'Recoleta' },
      { id: 13128, nombre: 'Renca' },
      { id: 13129, nombre: 'San Joaquín' },
      { id: 13130, nombre: 'San Miguel' },
      { id: 13131, nombre: 'San Ramón' },
      { id: 13132, nombre: 'Vitacura' },
      { id: 13201, nombre: 'Puente Alto' },
      { id: 13202, nombre: 'Pirque' },
      { id: 13203, nombre: 'San José de Maipo' },
      { id: 13301, nombre: 'Colina' },
      { id: 13302, nombre: 'Lampa' },
      { id: 13303, nombre: 'Tiltil' },
      { id: 13401, nombre: 'San Bernardo' },
      { id: 13402, nombre: 'Buin' },
      { id: 13403, nombre: 'Calera de Tango' },
      { id: 13404, nombre: 'Paine' },
      { id: 13501, nombre: 'Melipilla' },
      { id: 13502, nombre: 'Alhué' },
      { id: 13503, nombre: 'Curacaví' },
      { id: 13504, nombre: 'María Pinto' },
      { id: 13505, nombre: 'San Pedro' },
      { id: 13601, nombre: 'Talagante' },
      { id: 13602, nombre: 'El Monte' },
      { id: 13603, nombre: 'Isla de Maipo' },
      { id: 13604, nombre: 'Padre Hurtado' },
      { id: 13605, nombre: 'Peñaflor' }
    ]
  },
  {
    id: 6,
    nombre: 'Región del Libertador General Bernardo O\'Higgins',
    comunas: [
      { id: 61101, nombre: 'Rancagua' },
      { id: 61102, nombre: 'Codegua' },
      { id: 61103, nombre: 'Coinco' },
      { id: 61104, nombre: 'Coltauco' },
      { id: 61105, nombre: 'Doñihue' },
      { id: 61106, nombre: 'Graneros' },
      { id: 61107, nombre: 'Las Cabras' },
      { id: 61108, nombre: 'Machalí' },
      { id: 61109, nombre: 'Malloa' },
      { id: 61110, nombre: 'Mostazal' },
      { id: 61111, nombre: 'Olivar' },
      { id: 61112, nombre: 'Peumo' },
      { id: 61113, nombre: 'Pichidegua' },
      { id: 61114, nombre: 'Quinta de Tilcoco' },
      { id: 61115, nombre: 'Rengo' },
      { id: 61116, nombre: 'Requínoa' },
      { id: 61117, nombre: 'San Vicente' },
      { id: 62101, nombre: 'Pichilemu' },
      { id: 62102, nombre: 'La Estrella' },
      { id: 62103, nombre: 'Litueche' },
      { id: 62104, nombre: 'Marchihue' },
      { id: 62105, nombre: 'Navidad' },
      { id: 62106, nombre: 'Paredones' },
      { id: 63101, nombre: 'San Fernando' },
      { id: 63102, nombre: 'Chépica' },
      { id: 63103, nombre: 'Chimbarongo' },
      { id: 63104, nombre: 'Lolol' },
      { id: 63105, nombre: 'Nancagua' },
      { id: 63106, nombre: 'Palmilla' },
      { id: 63107, nombre: 'Peralillo' },
      { id: 63108, nombre: 'Placilla' },
      { id: 63109, nombre: 'Pumanque' },
      { id: 63110, nombre: 'Santa Cruz' }
    ]
  },
  {
    id: 7,
    nombre: 'Región del Maule',
    comunas: [
      { id: 71101, nombre: 'Talca' },
      { id: 71102, nombre: 'Constitución' },
      { id: 71103, nombre: 'Curepto' },
      { id: 71104, nombre: 'Empedrado' },
      { id: 71105, nombre: 'Maule' },
      { id: 71106, nombre: 'Pelarco' },
      { id: 71107, nombre: 'Pencahue' },
      { id: 71108, nombre: 'Río Claro' },
      { id: 71109, nombre: 'San Clemente' },
      { id: 71110, nombre: 'San Rafael' },
      { id: 72101, nombre: 'Cauquenes' },
      { id: 72102, nombre: 'Chanco' },
      { id: 72103, nombre: 'Pelluhue' },
      { id: 73101, nombre: 'Curicó' },
      { id: 73102, nombre: 'Hualañé' },
      { id: 73103, nombre: 'Licantén' },
      { id: 73104, nombre: 'Molina' },
      { id: 73105, nombre: 'Rauco' },
      { id: 73106, nombre: 'Romeral' },
      { id: 73107, nombre: 'Sagrada Familia' },
      { id: 73108, nombre: 'Teno' },
      { id: 73109, nombre: 'Vichuquén' },
      { id: 74101, nombre: 'Linares' },
      { id: 74102, nombre: 'Colbún' },
      { id: 74103, nombre: 'Longaví' },
      { id: 74104, nombre: 'Parral' },
      { id: 74105, nombre: 'Retiro' },
      { id: 74106, nombre: 'San Javier' },
      { id: 74107, nombre: 'Villa Alegre' },
      { id: 74108, nombre: 'Yerbas Buenas' }
    ]
  },
  {
    id: 8,
    nombre: 'Región del Biobío',
    comunas: [
      { id: 81101, nombre: 'Concepción' },
      { id: 81102, nombre: 'Coronel' },
      { id: 81103, nombre: 'Chiguayante' },
      { id: 81104, nombre: 'Florida' },
      { id: 81105, nombre: 'Hualqui' },
      { id: 81106, nombre: 'Lota' },
      { id: 81107, nombre: 'Penco' },
      { id: 81108, nombre: 'San Pedro de la Paz' },
      { id: 81109, nombre: 'Santa Juana' },
      { id: 81110, nombre: 'Talcahuano' },
      { id: 81111, nombre: 'Tomé' },
      { id: 81112, nombre: 'Hualpén' },
      { id: 82101, nombre: 'Lebu' },
      { id: 82102, nombre: 'Arauco' },
      { id: 82103, nombre: 'Cañete' },
      { id: 82104, nombre: 'Contulmo' },
      { id: 82105, nombre: 'Curanilahue' },
      { id: 82106, nombre: 'Los Álamos' },
      { id: 82107, nombre: 'Tirúa' },
      { id: 83101, nombre: 'Los Ángeles' },
      { id: 83102, nombre: 'Antuco' },
      { id: 83103, nombre: 'Cabrero' },
      { id: 83104, nombre: 'Laja' },
      { id: 83105, nombre: 'Mulchén' },
      { id: 83106, nombre: 'Nacimiento' },
      { id: 83107, nombre: 'Negrete' },
      { id: 83108, nombre: 'Quilaco' },
      { id: 83109, nombre: 'Quilleco' },
      { id: 83110, nombre: 'San Rosendo' },
      { id: 83111, nombre: 'Santa Bárbara' },
      { id: 83112, nombre: 'Tucapel' },
      { id: 83113, nombre: 'Yumbel' },
      { id: 83114, nombre: 'Alto Biobío' },
      { id: 84101, nombre: 'Chillán' },
      { id: 84102, nombre: 'Bulnes' },
      { id: 84103, nombre: 'Cobquecura' },
      { id: 84104, nombre: 'Coelemu' },
      { id: 84105, nombre: 'Coihueco' },
      { id: 84106, nombre: 'Chillán Viejo' },
      { id: 84107, nombre: 'El Carmen' },
      { id: 84108, nombre: 'Ninhue' },
      { id: 84109, nombre: 'Ñiquén' },
      { id: 84110, nombre: 'Pemuco' },
      { id: 84111, nombre: 'Pinto' },
      { id: 84112, nombre: 'Portezuelo' },
      { id: 84113, nombre: 'Quillón' },
      { id: 84114, nombre: 'Quirihue' },
      { id: 84115, nombre: 'Ránquil' },
      { id: 84116, nombre: 'San Carlos' },
      { id: 84117, nombre: 'San Fabián' },
      { id: 84118, nombre: 'San Ignacio' },
      { id: 84119, nombre: 'San Nicolás' },
      { id: 84120, nombre: 'Treguaco' },
      { id: 84121, nombre: 'Yungay' }
    ]
  },
  {
    id: 9,
    nombre: 'Región de La Araucanía',
    comunas: [
      { id: 91101, nombre: 'Temuco' },
      { id: 91102, nombre: 'Carahue' },
      { id: 91103, nombre: 'Cunco' },
      { id: 91104, nombre: 'Curarrehue' },
      { id: 91105, nombre: 'Freire' },
      { id: 91106, nombre: 'Galvarino' },
      { id: 91107, nombre: 'Gorbea' },
      { id: 91108, nombre: 'Lautaro' },
      { id: 91109, nombre: 'Loncoche' },
      { id: 91110, nombre: 'Melipeuco' },
      { id: 91111, nombre: 'Nueva Imperial' },
      { id: 91112, nombre: 'Padre Las Casas' },
      { id: 91113, nombre: 'Perquenco' },
      { id: 91114, nombre: 'Pitrufquén' },
      { id: 91115, nombre: 'Pucón' },
      { id: 91116, nombre: 'Saavedra' },
      { id: 91117, nombre: 'Teodoro Schmidt' },
      { id: 91118, nombre: 'Toltén' },
      { id: 91119, nombre: 'Vilcún' },
      { id: 91120, nombre: 'Villarrica' },
      { id: 91121, nombre: 'Cholchol' },
      { id: 92101, nombre: 'Angol' },
      { id: 92102, nombre: 'Collipulli' },
      { id: 92103, nombre: 'Curacautín' },
      { id: 92104, nombre: 'Ercilla' },
      { id: 92105, nombre: 'Lonquimay' },
      { id: 92106, nombre: 'Los Sauces' },
      { id: 92107, nombre: 'Lumaco' },
      { id: 92108, nombre: 'Purén' },
      { id: 92109, nombre: 'Renaico' },
      { id: 92110, nombre: 'Traiguén' },
      { id: 92111, nombre: 'Victoria' }
    ]
  },
  {
    id: 14,
    nombre: 'Región de Los Ríos',
    comunas: [
      { id: 14101, nombre: 'Valdivia' },
      { id: 14102, nombre: 'Corral' },
      { id: 14103, nombre: 'Lanco' },
      { id: 14104, nombre: 'Los Lagos' },
      { id: 14105, nombre: 'Máfil' },
      { id: 14106, nombre: 'Mariquina' },
      { id: 14107, nombre: 'Paillaco' },
      { id: 14108, nombre: 'Panguipulli' },
      { id: 14109, nombre: 'La Unión' },
      { id: 14110, nombre: 'Futrono' },
      { id: 14111, nombre: 'Lago Ranco' },
      { id: 14112, nombre: 'Río Bueno' }
    ]
  },
  {
    id: 10,
    nombre: 'Región de Los Lagos',
    comunas: [
      { id: 10101, nombre: 'Puerto Montt' },
      { id: 10102, nombre: 'Calbuco' },
      { id: 10103, nombre: 'Cochamó' },
      { id: 10104, nombre: 'Fresia' },
      { id: 10105, nombre: 'Frutillar' },
      { id: 10106, nombre: 'Los Muermos' },
      { id: 10107, nombre: 'Llanquihue' },
      { id: 10108, nombre: 'Maullín' },
      { id: 10109, nombre: 'Puerto Varas' },
      { id: 10201, nombre: 'Castro' },
      { id: 10202, nombre: 'Ancud' },
      { id: 10203, nombre: 'Chonchi' },
      { id: 10204, nombre: 'Curaco de Vélez' },
      { id: 10205, nombre: 'Dalcahue' },
      { id: 10206, nombre: 'Puqueldón' },
      { id: 10207, nombre: 'Queilén' },
      { id: 10208, nombre: 'Quellón' },
      { id: 10209, nombre: 'Quemchi' },
      { id: 10210, nombre: 'Quinchao' },
      { id: 10301, nombre: 'Osorno' },
      { id: 10302, nombre: 'Puerto Octay' },
      { id: 10303, nombre: 'Purranque' },
      { id: 10304, nombre: 'Puyehue' },
      { id: 10305, nombre: 'Río Negro' },
      { id: 10306, nombre: 'San Juan de la Costa' },
      { id: 10307, nombre: 'San Pablo' },
      { id: 10401, nombre: 'Chaitén' },
      { id: 10402, nombre: 'Futaleufú' },
      { id: 10403, nombre: 'Hualaihué' },
      { id: 10404, nombre: 'Palena' }
    ]
  },
  {
    id: 11,
    nombre: 'Región de Aysén del General Carlos Ibáñez del Campo',
    comunas: [
      { id: 11101, nombre: 'Coyhaique' },
      { id: 11102, nombre: 'Lago Verde' },
      { id: 11201, nombre: 'Aysén' },
      { id: 11202, nombre: 'Cisnes' },
      { id: 11203, nombre: 'Guaitecas' },
      { id: 11301, nombre: 'Cochrane' },
      { id: 11302, nombre: 'O\'Higgins' },
      { id: 11303, nombre: 'Tortel' },
      { id: 11401, nombre: 'Chile Chico' },
      { id: 11402, nombre: 'Río Ibáñez' }
    ]
  },
  {
    id: 12,
    nombre: 'Región de Magallanes y de la Antártica Chilena',
    comunas: [
      { id: 12101, nombre: 'Punta Arenas' },
      { id: 12102, nombre: 'Laguna Blanca' },
      { id: 12103, nombre: 'Río Verde' },
      { id: 12104, nombre: 'San Gregorio' },
      { id: 12201, nombre: 'Cabo de Hornos' },
      { id: 12202, nombre: 'Antártica' },
      { id: 12301, nombre: 'Porvenir' },
      { id: 12302, nombre: 'Primavera' },
      { id: 12303, nombre: 'Timaukel' },
      { id: 12401, nombre: 'Natales' },
      { id: 12402, nombre: 'Torres del Paine' }
    ]
  }
];

export default function CompanyModal({ 
  mode, 
  company, 
  onSave, 
  onDelete, 
  children 
}: CompanyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Company>({
    companyName: '',
    companyRun: '',
    logoIrid: '',
    bannerIrid: '',
    htmlIrid: '',
    contactRut: '',
    contactName: '',
    contactSurname: '',
    contactEmail: '',
    contactPhone: '',
    contactDirStates: undefined,
    contactDirCounty: undefined,
    contactDirStreet1: '',
    contactDirStreet2: '',
    contactDirStNumber: '',
    contactDirInNumber: ''
  });
  const [errors, setErrors] = useState<{[key:string]: string}>(initialErrors);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(undefined);
  const [availableComunas, setAvailableComunas] = useState<{id: number, nombre: string}[]>([]);

  useEffect(() => {
    if (company && mode !== 'create') {
      setFormData(company);
      setErrors(initialErrors);
    } else if (mode === 'create') {
      setFormData({
        companyName: '',
        companyRun: '',
        logoIrid: '',
        bannerIrid: '',
        htmlIrid: '',
        contactRut: '',
        contactName: '',
        contactSurname: '',
        contactEmail: '',
        contactPhone: '',
        contactDirStates: undefined,
        contactDirCounty: undefined,
        contactDirStreet1: '',
        contactDirStreet2: '',
        contactDirStNumber: '',
        contactDirInNumber: ''
      });
      setErrors(initialErrors);
    }
  }, [company, mode]);

  // Efecto separado para manejar la actualización de comunas
  useEffect(() => {
    if (formData.contactDirStates) {
      const region = regiones.find(r => r.id === formData.contactDirStates);
      setAvailableComunas(region ? region.comunas : []);
    } else {
      setAvailableComunas([]);
    }
  }, [formData.contactDirStates]);

  const validate = () => {
    const newErrors: {[key:string]: string} = {...initialErrors};
    if (!formData.companyName) newErrors.companyName = 'El nombre es requerido';
    if (!formData.companyRun) newErrors.companyRun = 'El RUN es requerido';
    if (!formData.contactRut) newErrors.contactRut = 'El RUT de contacto es requerido';
    if (!formData.contactName) newErrors.contactName = 'El nombre de contacto es requerido';
    if (!formData.contactSurname) newErrors.contactSurname = 'El apellido de contacto es requerido';
    if (!formData.contactEmail) newErrors.contactEmail = 'El email de contacto es requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.contactEmail)) newErrors.contactEmail = 'Email inválido';
    if (!formData.contactPhone) newErrors.contactPhone = 'El teléfono de contacto es requerido';
    else if (!/^\+?\d[\d\s\-()]{7,}$/.test(formData.contactPhone)) newErrors.contactPhone = 'Teléfono inválido';
    if (!formData.contactDirStreet1) newErrors.contactDirStreet1 = 'La calle es requerida';
    if (!formData.contactDirStNumber) newErrors.contactDirStNumber = 'El número es requerido';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSave) {
      onSave(formData);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsOpen(false);
    }
  };

  const isViewMode = mode === 'view';

  const inputClass = (field: string) =>
    `w-full ${errors[field] ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {mode === 'create' && 'Crear Empresa'}
                {mode === 'edit' && 'Editar Empresa'}
                {mode === 'view' && 'Ver Empresa'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de la Empresa <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('companyName')}
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">RUN de la Empresa <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('companyRun')}
                    value={formData.companyRun}
                    onChange={(e) => setFormData({...formData, companyRun: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.companyRun && <p className="text-red-500 text-xs mt-1">{errors.companyRun}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo IRID</label>
                  <Input
                    type="text"
                    value={formData.logoIrid}
                    onChange={(e) => setFormData({...formData, logoIrid: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Banner IRID</label>
                  <Input
                    type="text"
                    value={formData.bannerIrid}
                    onChange={(e) => setFormData({...formData, bannerIrid: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">HTML IRID</label>
                  <Input
                    type="text"
                    value={formData.htmlIrid}
                    onChange={(e) => setFormData({...formData, htmlIrid: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">RUT de Contacto <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('contactRut')}
                    value={formData.contactRut}
                    onChange={(e) => setFormData({...formData, contactRut: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactRut && <p className="text-red-500 text-xs mt-1">{errors.contactRut}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de Contacto <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('contactName')}
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apellido de Contacto <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('contactSurname')}
                    value={formData.contactSurname}
                    onChange={(e) => setFormData({...formData, contactSurname: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactSurname && <p className="text-red-500 text-xs mt-1">{errors.contactSurname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email de Contacto <span className="text-red-500">*</span></label>
                  <Input
                    type="email"
                    className={inputClass('contactEmail')}
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono de Contacto <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    className={inputClass('contactPhone')}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Región</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.contactDirStates || ''}
                    onChange={e => {
                      const regionId = e.target.value ? Number(e.target.value) : undefined;
                      setFormData({
                        ...formData,
                        contactDirStates: regionId,
                        contactDirCounty: undefined // reset comuna
                      });
                    }}
                    disabled={isViewMode}
                  >
                    <option value="">Selecciona una región</option>
                    {regiones.map(region => (
                      <option key={region.id} value={region.id}>{region.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comuna</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.contactDirCounty || ''}
                    onChange={e => setFormData({...formData, contactDirCounty: e.target.value ? Number(e.target.value) : undefined})}
                    disabled={isViewMode || !formData.contactDirStates}
                  >
                    <option value="">Selecciona una comuna</option>
                    {availableComunas.map(comuna => (
                      <option key={comuna.id} value={comuna.id}>{comuna.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Calle <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('contactDirStreet1')}
                    value={formData.contactDirStreet1}
                    onChange={(e) => setFormData({...formData, contactDirStreet1: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactDirStreet1 && <p className="text-red-500 text-xs mt-1">{errors.contactDirStreet1}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sector</label>
                  <Input
                    type="text"
                    value={formData.contactDirStreet2}
                    onChange={(e) => setFormData({...formData, contactDirStreet2: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('contactDirStNumber')}
                    value={formData.contactDirStNumber}
                    onChange={(e) => setFormData({...formData, contactDirStNumber: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.contactDirStNumber && <p className="text-red-500 text-xs mt-1">{errors.contactDirStNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número Interior</label>
                  <Input
                    type="text"
                    value={formData.contactDirInNumber}
                    onChange={(e) => setFormData({...formData, contactDirInNumber: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  {mode === 'edit' && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Eliminar
                    </Button>
                  )}
                  {!isViewMode && (
                    <Button type="submit">
                      {mode === 'create' ? 'Crear' : 'Guardar'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 