import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Modal';
import CompanyForm from './CompanyForm';

interface CompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: number;
  title: string;
  onSuccess: () => void;
}

export default function CompanyDialog({
  isOpen,
  onClose,
  companyId,
  title,
  onSuccess
}: CompanyDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CompanyForm
          companyId={companyId}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
} 