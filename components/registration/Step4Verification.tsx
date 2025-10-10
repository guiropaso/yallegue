'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { Upload, FileText, Shield, Loader2, AlertCircle, CheckCircle, X, Eye } from 'lucide-react'

export default function Step4Verification() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [existingDocuments, setExistingDocuments] = useState<{
    duiFront?: string
    duiBack?: string
    policeRecord?: string
  }>({})
  
  const { user, documents, setDocuments, setLoading, setError: setStoreError, prevStep } = useProviderStore()
  
  // Debug existing documents
  console.log('Current existing documents state:', existingDocuments)
  

  useEffect(() => {
    // Load existing document data if available
    const loadExistingData = async () => {
      console.log('Loading existing data for user:', user?.id)
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('provider_documents')
          .select('*')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false })

        console.log('Database query result:', { data, error })
        
        if (data && data.length > 0 && !error) {
          const latestDocument = data[0]
          console.log('Setting existing documents:', {
            duiFront: latestDocument.dui_front_url,
            duiBack: latestDocument.dui_back_url,
            policeRecord: latestDocument.police_record_url
          })
          setExistingDocuments({
            duiFront: latestDocument.dui_front_url,
            duiBack: latestDocument.dui_back_url,
            policeRecord: latestDocument.police_record_url
          })
        } else {
          console.log('No existing documents found or error:', error)
        }
      } catch (err) {
        console.error('Error loading existing document data:', err)
      }
    }

    loadExistingData()
  }, [user?.id])

  const handleFileSelect = (type: keyof typeof documents, file: File | null) => {
    setDocuments({ [type]: file })
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('provider_documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('provider_documents')
      .getPublicUrl(data.path)

    return publicUrl
  }

  const handleFileUpload = async (type: keyof typeof documents, file: File) => {
    if (!user?.id) return

    const path = `${user.id}/${type}/${Date.now()}-${file.name}`
    
    try {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min(prev[type] + 10, 90)
        }))
      }, 100)

      const url = await uploadFile(file, path)
      
      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))
      
      return url
    } catch (err) {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      throw err
    }
  }

  const handleSubmit = async () => {
    if (!user?.id) return

    // Check if we have either new files or existing documents
    const hasNewFiles = documents.duiFront || documents.duiBack || documents.policeRecord
    const hasExistingFiles = existingDocuments.duiFront || existingDocuments.duiBack || existingDocuments.policeRecord
    
    if (!hasNewFiles && !hasExistingFiles) {
      setError('Por favor, sube todos los documentos requeridos.')
      return
    }

    setIsLoading(true)
    setError(null)
    setStoreError(null)

    try {
      let duiFrontUrl = existingDocuments.duiFront
      let duiBackUrl = existingDocuments.duiBack
      let policeRecordUrl = existingDocuments.policeRecord

      // Upload new files if they exist
      if (documents.duiFront) {
        duiFrontUrl = await handleFileUpload('duiFront', documents.duiFront)
      }
      if (documents.duiBack) {
        duiBackUrl = await handleFileUpload('duiBack', documents.duiBack)
      }
      if (documents.policeRecord) {
        policeRecordUrl = await handleFileUpload('policeRecord', documents.policeRecord)
      }

      // Save document URLs to database
      const { error } = await supabase
        .from('provider_documents')
        .upsert({
          provider_id: user.id,
          dui_front_url: duiFrontUrl,
          dui_back_url: duiBackUrl,
          police_record_url: policeRecordUrl
        })

      if (error) {
        throw error
      }

      // Update provider registration step to completed
      const { error: updateError } = await supabase
        .from('providers')
        .update({ registration_step: 5 })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setIsComplete(true)
    } catch (err: any) {
      console.error('Error uploading documents:', err)
      setError('Error al subir los documentos. Por favor, inténtalo de nuevo.')
      setStoreError('Error al subir los documentos. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const FileUploadField = ({ 
    type, 
    label, 
    description, 
    accept
  }: { 
    type: keyof typeof documents
    label: string
    description: string
    accept: string
  }) => {
    const file = documents[type]
    const progress = uploadProgress[type] || 0
    const inputRef = useRef<HTMLInputElement>(null)
    const existingUrl = existingDocuments[type as keyof typeof existingDocuments]

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} *
        </label>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        
        {file ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFileSelect(type, null)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {progress > 0 && progress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FF1B1C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Subiendo... {progress}%</p>
              </div>
            )}
          </div>
        ) : existingUrl ? (
          <div className="border border-green-200 rounded-xl p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Documento ya subido</p>
                  <p className="text-xs text-green-700">Archivo previamente cargado</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                >
                  Reemplazar
                </button>
                <a
                  href={existingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-green-200 rounded-full transition-colors"
                >
                  <Eye className="w-4 h-4 text-green-600" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FF1B1C] hover:bg-[#FF1B1C]/5 cursor-pointer transition-all duration-200"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Haz clic para subir archivo</p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileSelect(type, file)
            }
          }}
          className="hidden"
        />
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Registro completado!
          </h3>
          <p className="text-gray-600 mb-6">
            Tu registro ha sido enviado con éxito. Nuestro equipo revisará tu información y te contactará por WhatsApp o correo electrónico.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">Próximos pasos</p>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Revisaremos tu información en 24-48 horas</li>
            <li>• Te contactaremos por WhatsApp para verificación</li>
            <li>• Una vez aprobado, podrás recibir solicitudes de servicios</li>
          </ul>
        </div>

        <Button
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 px-8 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verificación de Identidad
        </h3>
        <p className="text-gray-600">
          Sube los documentos requeridos para verificar tu identidad y completar tu registro.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">Error de validación</p>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <FileUploadField
          type="duiFront"
          label="Foto del DUI (Frente)"
          description="Sube una foto clara del frente de tu DUI"
          accept="image/*"
        />

        <FileUploadField
          type="duiBack"
          label="Foto del DUI (Reverso)"
          description="Sube una foto clara del reverso de tu DUI"
          accept="image/*"
        />

        <FileUploadField
          type="policeRecord"
          label="Antecedentes Penales"
          description="Sube tu certificado de antecedentes penales (PDF o imagen)"
          accept=".pdf,image/*"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Información de seguridad</p>
            <p className="text-xs text-blue-700">
              Tus documentos son procesados de forma segura y solo serán utilizados para verificar tu identidad. 
              No compartimos esta información con terceros.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Atrás
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!documents.duiFront && !existingDocuments.duiFront) || (!documents.duiBack && !existingDocuments.duiBack) || (!documents.policeRecord && !existingDocuments.policeRecord)}
          className="flex-1 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Subiendo documentos...
            </>
          ) : (
            'Completar registro'
          )}
        </Button>
      </div>
    </div>
  )
}
