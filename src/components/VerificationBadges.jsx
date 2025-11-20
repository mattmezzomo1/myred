import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Video, FileText, Camera } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VerificationBadges({ user, size = 'default' }) {
  if (!user || !user.verified) return null;

  const { document, selfie, video } = user.verified;
  const isFullyVerified = document && selfie;
  const isManOfValue = user.userType === 'man' && document && selfie && video;

  const badgeSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'small' ? 'text-xs' : 'text-sm';

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {/* Man of Value Badge (only for men with full verification) */}
        {isManOfValue && (
          <Tooltip>
            <TooltipTrigger>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Shield className={`${badgeSize} mr-1`} />
                <span className={textSize}>Homem de Valor</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Verificação completa: Documento, Selfie e Vídeo</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Verified Badge (document + selfie) */}
        {isFullyVerified && !isManOfValue && (
          <Tooltip>
            <TooltipTrigger>
              <Badge className="bg-blue-600 text-white border-0">
                <CheckCircle className={`${badgeSize} mr-1`} />
                <span className={textSize}>Verificado</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Identidade verificada</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Individual verification badges */}
        {document && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <FileText className={`${badgeSize} mr-1`} />
                {size !== 'small' && <span className={textSize}>Documento</span>}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documento verificado</p>
            </TooltipContent>
          </Tooltip>
        )}

        {selfie && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <Camera className={`${badgeSize} mr-1`} />
                {size !== 'small' && <span className={textSize}>Selfie</span>}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Selfie com prova de vida verificada</p>
            </TooltipContent>
          </Tooltip>
        )}

        {video && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="border-purple-600 text-purple-700">
                <Video className={`${badgeSize} mr-1`} />
                {size !== 'small' && <span className={textSize}>Vídeo</span>}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Entrevista em vídeo verificada</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

