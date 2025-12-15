'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { Upload, FileText, Shield, Loader2, AlertCircle, CheckCircle, X, Eye } from 'lucide-react'

export default function Step4Verification() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [compressing, setCompressing] = useState<{ [key: string]: boolean }>({})
  const [originalFileInfo, setOriginalFileInfo] = useState<{
    [key: string]: { name: string; size: number }
  }>({})
  const [existingDocuments, setExistingDocuments] = useState<{
    duiFront?: string
    duiBack?: string
    policeRecord?: string
  }>({})
  const [signedUrls, setSignedUrls] = useState<{
    [key: string]: string
  }>({})
  
  const { user, documents, setDocuments, setLoading, setError: setStoreError, prevStep } = useProviderStore()
  
  useEffect(() => {
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
          const documents: { [key: string]: string } = {}
          
          // Store paths (these could be old URLs or new paths)
          if (latestDocument.dui_front_url) documents.duiFront = latestDocument.dui_front_url
          if (latestDocument.dui_back_url) documents.duiBack = latestDocument.dui_back_url
          if (latestDocument.police_record_url) documents.policeRecord = latestDocument.police_record_url
          
          setExistingDocuments(documents)
          
          // Generate signed URLs for paths (not old public URLs)
          const urlMap: { [key: string]: string } = {}
          const expiry = 3600 // 1 hour
          
          for (const [type, pathOrUrl] of Object.entries(documents)) {
            // Check if it's a path (starts with user.id/) or an old URL
            // Paths look like: "user-id/duiFront/timestamp-filename.jpg"
            // Old URLs look like: "https://..."
            if (pathOrUrl && !pathOrUrl.startsWith('http')) {
              const { data: signedUrlData } = await supabase.storage
                .from('provider_documents')
                .createSignedUrl(pathOrUrl, expiry)
              
              if (signedUrlData?.signedUrl) {
                urlMap[type] = signedUrlData.signedUrl
              }
            } else if (pathOrUrl && pathOrUrl.startsWith('http')) {
              // Keep old URLs as-is for backward compatibility
              urlMap[type] = pathOrUrl
            }
          }
          
          setSignedUrls(urlMap)
        }
      } catch (err) {
        console.error('Error loading existing document data:', err)
      }
    }

    loadExistingData()
  }, [user?.id])

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/') || 
           file.name.toLowerCase().endsWith('.heic') ||
           file.name.toLowerCase().endsWith('.heif')
  }

  const isPdfFile = (file: File): boolean => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  }

  // Convert HEIC to JPEG
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      const heic2any = (await import('heic2any')).default
      
      console.log('Converting HEIC file:', file.name)
      
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9
      })
      
      const convertedBlob = Array.isArray(converted) ? converted[0] : converted
      
      if (!(convertedBlob instanceof Blob)) {
        throw new Error('HEIC conversion did not return a valid Blob')
      }

      const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
      const convertedFile = new File(
        [convertedBlob], 
        newFileName, 
        {
          type: 'image/jpeg',
          lastModified: Date.now()
        }
      )
      
      console.log('HEIC converted successfully')
      return convertedFile
    } catch (err) {
      console.error('Error converting HEIC to JPEG:', err)
      throw new Error('No se pudo convertir el archivo HEIC. Por favor, usa un formato JPG o PNG.')
    }
  }

  // Native browser-based image compression using Canvas API (Safari compatible)
  const compressImage = async (file: File): Promise<File> => {
    const maxSizeMB = 1
    const maxWidthOrHeight = 1080
    const quality = 0.8

    try {
      console.log('Starting native compression for:', file.name)

      // Read file as data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Create image element
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = dataUrl
      })

      // Calculate new dimensions
      let width = img.width
      let height = img.height

      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width > height) {
          height = (height / width) * maxWidthOrHeight
          width = maxWidthOrHeight
        } else {
          width = (width / height) * maxWidthOrHeight
          height = maxWidthOrHeight
        }
      }

      // Create canvas and compress
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas')
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Safari-compatible: Convert canvas to blob using toDataURL
      const convertCanvasToBlob = async (currentQuality: number): Promise<Blob> => {
        // Use toDataURL which has better Safari support
        const dataURL = canvas.toDataURL('image/jpeg', currentQuality)
        
        // Convert data URL to blob
        const base64 = dataURL.split(',')[1]
        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        return new Blob([bytes], { type: 'image/jpeg' })
      }

      // Get initial blob
      let finalBlob = await convertCanvasToBlob(quality)
      let currentQuality = quality

      // If still too large, reduce quality further
      while (finalBlob.size > maxSizeMB * 1024 * 1024 && currentQuality > 0.3) {
        currentQuality -= 0.1
        finalBlob = await convertCanvasToBlob(currentQuality)
      }

      // Create new File from blob
      const originalName = file.name.replace(/\.[^/.]+$/, '')
      const compressedFile = new File(
        [finalBlob],
        `${originalName}.jpg`,
        {
          type: 'image/jpeg',
          lastModified: Date.now()
        }
      )

      console.log('Compression successful:', {
        originalSize: file.size,
        compressedSize: compressedFile.size,
        reduction: ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%'
      })

      return compressedFile
    } catch (err) {
      console.error('Error compressing image:', err)
      throw new Error('No se pudo comprimir la imagen. Por favor, intenta con otro archivo.')
    }
  }

  const validatePdf = (file: File): void => {
    const maxSizeMB = 10
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      throw new Error(`El archivo PDF es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`)
    }
  }

  const handleFileSelect = async (type: keyof typeof documents, file: File | null) => {
    if (!file) {
      setDocuments({ [type]: null })
      setOriginalFileInfo(prev => {
        const updated = { ...prev }
        delete updated[type]
        return updated
      })
      return
    }

    setCompressing(prev => ({ ...prev, [type]: true }))
    setError(null)

    try {
      let processedFile: File = file
      const originalName = file.name
      const originalSize = file.size

      console.log('Processing file:', { name: originalName, size: originalSize, type: file.type })

      // Handle HEIC files
      if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        console.log('HEIC file detected, converting...')
        processedFile = await convertHeicToJpeg(file)
        console.log('HEIC conversion complete')
      }

      // Process based on file type
      if (isPdfFile(processedFile)) {
        validatePdf(processedFile)
        setOriginalFileInfo(prev => ({
          ...prev,
          [type]: { name: originalName, size: originalSize }
        }))
      } else if (isImageFile(processedFile)) {
        console.log('Compressing image...')
        const compressedFile = await compressImage(processedFile)
        
        // Store original info with the FINAL processed filename (not the input filename)
        setOriginalFileInfo(prev => ({
          ...prev,
          [type]: { name: compressedFile.name, size: originalSize }
        }))
        
        processedFile = compressedFile
      } else {
        throw new Error('Formato de archivo no soportado. Solo se permiten imágenes (JPG, PNG, HEIC) y PDFs.')
      }

      console.log('File processing complete')
      setDocuments({ [type]: processedFile })
    } catch (err: any) {
      console.error('Error processing file:', err)
      setError(err.message || 'Error al procesar el archivo. Por favor, intenta con otro archivo.')
      setDocuments({ [type]: null })
      setOriginalFileInfo(prev => {
        const updated = { ...prev }
        delete updated[type]
        return updated
      })
    } finally {
      setCompressing(prev => ({ ...prev, [type]: false }))
    }
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

    // Return the path instead of public URL for private buckets
    return data.path
  }

  const handleFileUpload = async (type: keyof typeof documents, file: File) => {
    if (!user?.id) return

    const path = `${user.id}/${type}/${Date.now()}-${file.name}`
    
    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      
      progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min((prev[type] || 0) + 10, 90)
        }))
      }, 100)

      const url = await uploadFile(file, path)
      
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))
      
      return url
    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      throw err
    }
  }

  const handleSubmit = async () => {
    if (!user?.id) return

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

      if (documents.duiFront) {
        duiFrontUrl = await handleFileUpload('duiFront', documents.duiFront)
      }
      if (documents.duiBack) {
        duiBackUrl = await handleFileUpload('duiBack', documents.duiBack)
      }
      if (documents.policeRecord) {
        policeRecordUrl = await handleFileUpload('policeRecord', documents.policeRecord)
      }

      // Save document paths to database with onConflict
      // Note: column names still say "url" but we're storing paths now
      const { error } = await supabase
        .from('provider_documents')
        .upsert({
          provider_id: user.id,
          dui_front_url: duiFrontUrl,
          dui_back_url: duiBackUrl,
          police_record_url: policeRecordUrl
        }, {
          onConflict: 'provider_id'
        })

      if (error) {
        console.error('Error upserting documents:', error)
        throw error
      }

      const { error: updateError } = await supabase
        .from('providers')
        .update({ registration_step: 5 })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      // Send completion email to the user
      if (user.email) {
        try {
          const storeState = useProviderStore.getState()
          const userName = storeState.personalInfo?.firstName && storeState.personalInfo?.lastName
            ? `${storeState.personalInfo.firstName} ${storeState.personalInfo.lastName}`
            : user.name || 'Usuario'
          
          await fetch('/api/send-application-complete-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userName,
              email: user.email,
            }),
          })
        } catch (emailError) {
          console.error('Error sending completion email:', emailError)
          // Don't fail the registration if email fails
        }
      }

      // Redirect to thank you page instead of showing completion message
      router.push('/providers/register/thank-you')
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
    const isCompressing = compressing[type] || false
    const originalInfo = originalFileInfo[type]
    const inputRef = useRef<HTMLInputElement>(null)
    const existingPath = existingDocuments[type as keyof typeof existingDocuments]
    const signedUrl = signedUrls[type]
    
    // Generate signed URL on demand when viewing
    const handleViewFile = async (e: React.MouseEvent) => {
      e.preventDefault()
      
      if (!existingPath) return
      
      // If it's an old URL, just open it
      if (existingPath.startsWith('http')) {
        window.open(existingPath, '_blank')
        return
      }
      
      // Use cached signed URL if available, otherwise generate a new one
      if (signedUrl) {
        window.open(signedUrl, '_blank')
        return
      }
      
      // Generate new signed URL
      try {
        const { data: signedUrlData, error } = await supabase.storage
          .from('provider_documents')
          .createSignedUrl(existingPath, 3600) // 1 hour expiry
        
        if (error) throw error
        
        if (signedUrlData?.signedUrl) {
          setSignedUrls(prev => ({ ...prev, [type]: signedUrlData.signedUrl }))
          window.open(signedUrlData.signedUrl, '_blank')
        }
      } catch (err) {
        console.error('Error generating signed URL:', err)
        setError('No se pudo generar el enlace para ver el archivo.')
      }
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} *
        </label>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        
        {isCompressing ? (
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-900">Procesando archivo...</p>
                <p className="text-xs text-blue-700">Por favor espera</p>
              </div>
            </div>
          </div>
        ) : file ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {originalInfo?.name || file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {originalInfo && originalInfo.size !== file.size && (
                        <span className="text-green-600 ml-1">
                          (original: {formatFileSize(originalInfo.size)})
                        </span>
                      )}
                    </p>
                  </div>
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
        ) : existingPath ? (
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
                <button
                  type="button"
                  onClick={handleViewFile}
                  className="p-1 hover:bg-green-200 rounded-full transition-colors"
                  title="Ver documento"
                >
                  <Eye className="w-4 h-4 text-green-600" />
                </button>
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
            <p className="text-xs text-gray-500">PNG, JPG, HEIC, PDF hasta 10MB</p>
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
            <li>• Revisaremos tu información </li>
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
          accept="image/*,.heic,.heif"
        />

        <FileUploadField
          type="duiBack"
          label="Foto del DUI (Reverso)"
          description="Sube una foto clara del reverso de tu DUI"
          accept="image/*,.heic,.heif"
        />

        <FileUploadField
          type="policeRecord"
          label="Antecedentes Penales"
          description="Sube tu certificado de antecedentes penales (PDF o imagen)"
          accept=".pdf,image/*,.heic,.heif"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 hidden md:block" />
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