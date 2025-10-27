'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

// Service Card Component
interface ServiceCardProps {
  title: string;
  subtitle?: string;
  description: string;
  price?: string;
  icon: React.ReactNode;
  buttonText: string;
  imageUrl: string;
  onReserve: () => void;
}

function ServiceCard({ title, subtitle, description, price, icon, buttonText, imageUrl, onReserve }: ServiceCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl h-[500px] flex flex-col">
      {/* Image Header Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Icon and Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              {subtitle && (
                <p className="text-white/90 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6 bg-white">
        <div className="flex-1">
          <CardDescription className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </CardDescription>
        </div>

        {/* Price Section - Fixed at bottom above button */}
        <div className="mb-4">
          {price && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FF1B1C] mb-1">{price}</div>
              <div className="text-sm text-gray-500">Precio del servicio</div>
            </div>
          )}
        </div>

        {/* Button at Bottom */}
        <div>
          <Button 
            onClick={onReserve}
            className="w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={`Reservar ${title}`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Booking Dialog Component
interface BookingDialogProps {
  service: 'airbnb' | 'house' | 'repair';
  title: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BookingDialog({ service, title, children, open, onOpenChange }: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const validateForm = (data: any) => {
    const newErrors: any = {};
    
    if (!data.nombre?.trim()) newErrors.nombre = 'Este campo es obligatorio';
    if (!data.telefono?.trim()) newErrors.telefono = 'Este campo es obligatorio';
    if (!data.email?.trim()) {
      newErrors.email = 'Este campo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!data.direccion?.trim()) newErrors.direccion = 'Este campo es obligatorio';
    if (!selectedDate) newErrors.fecha = 'Este campo es obligatorio';

    if (service === 'house') {
      if (!data.horario) newErrors.horario = 'Este campo es obligatorio';
      if (!data.tier) newErrors.tier = 'Este campo es obligatorio';
    }

    if (service === 'repair') {
      if (!data.horario) newErrors.horario = 'Este campo es obligatorio';
      if (!data.tipoEquipo) newErrors.tipoEquipo = 'Este campo es obligatorio';
      if (!data.descripcion?.trim()) newErrors.descripcion = 'Este campo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    
    try {
      // Track analytics event
      (window as any).dataLayer?.push({ 
        event: 'booking_attempt', 
        service: service 
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          payload: {
            ...formData,
            fecha: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            hora: selectedTime,
          },
        }),
      });

      if (response.ok) {
        toast.success('Reserva recibida. Nuestro proveedor se pondrá en contacto.');
        setFormData({});
        setSelectedDate(undefined);
        setSelectedTime('');
        onOpenChange(false);
      } else {
        throw new Error('Error al enviar la reserva');
      }
    } catch (error) {
      toast.error('Error al enviar la reserva. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Completa el formulario para reservar este servicio
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {service === 'airbnb' && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Por favor tenga sábanas limpias y útiles de limpieza (mopa, trapos) disponibles.
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre || ''}
              onChange={(e) => updateFormData('nombre', e.target.value)}
              placeholder="Tu nombre completo"
              aria-label="Nombre completo"
            />
            {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono || ''}
              onChange={(e) => updateFormData('telefono', e.target.value)}
              placeholder="Tu número de teléfono"
              aria-label="Número de teléfono"
            />
            {errors.telefono && <p className="text-sm text-red-600">{errors.telefono}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="tu@email.com"
              aria-label="Dirección de email"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">
              {service === 'airbnb' ? 'Ubicación' : 'Dirección'} *
            </Label>
            <Input
              id="direccion"
              value={formData.direccion || ''}
              onChange={(e) => updateFormData('direccion', e.target.value)}
              placeholder={service === 'airbnb' ? 'Dirección del Airbnb' : 'Dirección completa'}
              aria-label="Dirección"
            />
            {errors.direccion && <p className="text-sm text-red-600">{errors.direccion}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">
              {service === 'repair' ? 'Fecha y hora' : 'Fecha'} *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'Selecciona una fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                  }}
                  locale={es}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.fecha && <p className="text-sm text-red-600">{errors.fecha}</p>}
          </div>

          {service === 'house' && (
            <>
              <div className="space-y-3">
                <Label>Horario preferido *</Label>
                <RadioGroup
                  value={formData.horario || ''}
                  onValueChange={(value) => updateFormData('horario', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7:00-10:00" id="morning" />
                    <Label htmlFor="morning">7:00 – 10:00</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16:00-19:00" id="evening" />
                    <Label htmlFor="evening">16:00 – 19:00</Label>
                  </div>
                </RadioGroup>
                {errors.horario && <p className="text-sm text-red-600">{errors.horario}</p>}
              </div>

              <div className="space-y-3">
                <Label>Plan *</Label>
                <RadioGroup
                  value={formData.tier || ''}
                  onValueChange={(value) => updateFormData('tier', value)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="basico" id="basico" />
                      <Label htmlFor="basico" className="flex-1">
                        <div className="flex justify-between items-center">
                          <span>Básico</span>
                          <Badge variant="secondary">$20</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Barrer, trapear, limpieza de baño, sacudir, sacar basura
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1">
                        <div className="flex justify-between items-center">
                          <span>Standard</span>
                          <Badge variant="secondary">$25</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Todo de Básico + lavar platos, limpieza de hasta 2 dormitorios
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                {errors.tier && <p className="text-sm text-red-600">{errors.tier}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dormitorios">Número de dormitorios (opcional)</Label>
                <Input
                  id="dormitorios"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.dormitorios || ''}
                  onChange={(e) => updateFormData('dormitorios', e.target.value)}
                  placeholder="Ej: 2"
                  aria-label="Número de dormitorios"
                />
              </div>
            </>
          )}

          {service === 'repair' && (
            <>
              <div className="space-y-3">
                <Label>Horario preferido *</Label>
                <RadioGroup
                  value={formData.horario || ''}
                  onValueChange={(value) => updateFormData('horario', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mañana" id="repair-morning" />
                    <Label htmlFor="repair-morning">Por la mañana</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tarde" id="repair-evening" />
                    <Label htmlFor="repair-evening">Por la tarde</Label>
                  </div>
                </RadioGroup>
                {errors.horario && <p className="text-sm text-red-600">{errors.horario}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEquipo">Tipo de equipo *</Label>
                <Select
                  value={formData.tipoEquipo || ''}
                  onValueChange={(value) => updateFormData('tipoEquipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tv">TV</SelectItem>
                    <SelectItem value="lavadora">Lavadora</SelectItem>
                    <SelectItem value="secadora">Secadora</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoEquipo && <p className="text-sm text-red-600">{errors.tipoEquipo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción del problema *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion || ''}
                  onChange={(e) => updateFormData('descripcion', e.target.value)}
                  placeholder="Describe el problema que tiene tu electrodoméstico..."
                  rows={3}
                  aria-label="Descripción del problema"
                />
                {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion}</p>}
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Visita:</strong> $5 (se resta del precio final)
                </p>
              </div>
            </>
          )}

          {(service === 'airbnb' || service === 'repair') && (
            <div className="space-y-2">
              <Label htmlFor="descripcionAdicional">
                {service === 'airbnb' ? 'Descripción adicional (opcional)' : 'Información adicional (opcional)'}
              </Label>
              <Textarea
                id="descripcionAdicional"
                value={formData.descripcionAdicional || ''}
                onChange={(e) => updateFormData('descripcionAdicional', e.target.value)}
                placeholder={service === 'airbnb' ? 'Información adicional sobre la limpieza...' : 'Cualquier información adicional...'}
                rows={3}
                aria-label="Información adicional"
              />
            </div>
          )}

          <Separator />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar reserva'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main Page Component
export default function FirstServicesPage() {
  const [activeDialog, setActiveDialog] = useState<'airbnb' | 'house' | 'repair' | null>(null);

  const services = [
    {
      id: 'airbnb',
      title: 'Limpieza para Airbnb',
      subtitle: 'Horario disponible: 11:00 – 15:00',
      description: 'Servicio completo de limpieza para propiedades Airbnb. Incluye limpieza profunda de todas las áreas, cambio de sábanas y toallas.',
      price: '$35',
      buttonText: 'Reservar limpieza Airbnb',
      imageUrl: 'https://picsum.photos/800/600?random=1',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
    },
    {
      id: 'house',
      title: 'Limpieza de hogar',
      subtitle: 'Opciones Básico y Standard',
      description: 'Servicio de limpieza profesional para tu hogar. Elige entre plan básico ($20) o estándar ($25) según tus necesidades.',
      price: 'Desde $20',
      buttonText: 'Reservar limpieza',
      imageUrl: 'https://picsum.photos/800/600?random=2',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'repair',
      title: 'Reparación de electrodomésticos',
      subtitle: 'Visita técnica incluida',
      description: 'Reparación profesional de TV, lavadoras y secadoras. Visita técnica $5 (se descuenta del precio final).',
      price: 'Desde $15',
      buttonText: 'Solicitar visita técnica',
      imageUrl: 'https://picsum.photos/800/600?random=3',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lanzamiento Beta — <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">Servicios locales confiables</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Estamos probando un conjunto inicial de servicios en El Salvador. Reserva ahora para ayudarnos a validar demanda. Pronto lanzaremos una plataforma más completa con más servicios y funcionalidades.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver servicios disponibles
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services-grid" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                price={service.price}
                icon={service.icon}
                buttonText={service.buttonText}
                imageUrl={service.imageUrl}
                onReserve={() => setActiveDialog(service.id as 'airbnb' | 'house' | 'repair')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">nuestro servicio</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proceso simple y transparente para reservar tus servicios de manera rápida y segura. 
              Nuestro sistema está diseñado para brindarte la mejor experiencia desde la reserva hasta la finalización del servicio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF1B1C] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Selecciona tu servicio</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Elige entre limpieza de Airbnb, limpieza de hogar o reparación de electrodomésticos según tus necesidades.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF1B1C] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Completa el formulario</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Proporciona tus datos de contacto, ubicación y detalles específicos del servicio que necesitas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF1B1C] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Recibe confirmación</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nuestro proveedor se pondrá en contacto contigo para coordinar fecha, hora y detalles finales del servicio.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-sm border-0">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Side - Image */}
                <div className="flex-shrink-0 lg:w-1/3">
                  <div className="w-80 h-80 bg-gradient-to-br from-[#FF1B1C]/10 to-[#FF6B6B]/10 rounded-2xl flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-[#FF1B1C] to-[#FF6B6B] rounded-xl flex items-center justify-center">
                      <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="lg:w-2/3">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Beneficios para ti</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Cuando los servicios son tan fáciles de reservar, ninguna tarea es demasiado pequeña.
                  </p>
                  
                  {/* Benefits Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Reserva Rápida</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Reserva tu servicio en minutos con nuestro proceso simplificado. Sin complicaciones ni esperas largas.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Precios Transparentes</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Sin sorpresas ni costos ocultos. Conoce el precio exacto antes de confirmar tu reserva.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Proveedores Verificados</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Todos nuestros proveedores están verificados y tienen experiencia comprobada en sus servicios.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Soporte 24/7</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Nuestro equipo de soporte está disponible para ayudarte en cualquier momento que lo necesites.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialogs */}
      {services.map((service) => (
        <BookingDialog
          key={service.id}
          service={service.id as 'airbnb' | 'house' | 'repair'}
          title={service.title}
          open={activeDialog === service.id}
          onOpenChange={(open) => !open && setActiveDialog(null)}
        >
          <div />
        </BookingDialog>
      ))}
    </div>
  );
}
