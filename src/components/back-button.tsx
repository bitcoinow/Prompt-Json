import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export default function BackButton({ 
  className = '', 
  variant = 'outline', 
  size = 'default',
  ...props 
}: BackButtonProps) {
  const router = useRouter()
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.back()}
      className={`${className} flex items-center gap-2`}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  )
}