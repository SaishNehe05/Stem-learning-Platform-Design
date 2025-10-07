"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, Video, X, CheckCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  subject: string
  grade: string
  description: string
  uploadDate: string
}

export function MaterialUpload() {
  const { t } = useTranslation()

  const [files, setFiles] = useState<File[]>([])
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    description: "",
    title: "",
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0 || !formData.subject || !formData.grade) return

    setIsUploading(true)

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newMaterials: UploadedFile[] = files.map((file, index) => ({
      id: `material-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      subject: formData.subject,
      grade: formData.grade,
      description: formData.description,
      uploadDate: new Date().toISOString(),
    }))

    setUploadedMaterials((prev) => [...prev, ...newMaterials])

    // Reset form
    setFiles([])
    setFormData({ subject: "", grade: "", description: "", title: "" })
    setIsUploading(false)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t("bytes")}`
    const k = 1024
    const sizes = [t("bytes"), t("kb"), t("mb"), t("gb")]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            {t("uploadLearningMaterials")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">{t("subject")}</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectSubject")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">{t("mathematics")}</SelectItem>
                  <SelectItem value="science">{t("science")}</SelectItem>
                  <SelectItem value="technology">{t("technology")}</SelectItem>
                  <SelectItem value="engineering">{t("engineering")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade">{t("gradeLevel")}</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectGrade")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">{t("grade6")}</SelectItem>
                  <SelectItem value="7">{t("grade7")}</SelectItem>
                  <SelectItem value="both">{t("bothGrades")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">{t("materialTitle")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t("enterDescriptiveTitle")}
            />
          </div>

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t("describeLearningMaterial")}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="files">{t("selectFiles")}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">{t("dragDropFiles")}</p>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("files")?.click()}
                className="bg-transparent"
              >
                {t("selectFiles")}
              </Button>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>
                {t("selectedFiles")} ({files.length})
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || !formData.subject || !formData.grade || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t("uploadMaterials")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Materials */}
      {uploadedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {t("uploadedMaterials")} ({uploadedMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(material.type)}
                    <div>
                      <h4 className="font-medium">{material.name}</h4>
                      <p className="text-sm text-muted-foreground">{material.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {t(material.subject)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {t("grade")} {material.grade}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatFileSize(material.size)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">{t("uploaded")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
