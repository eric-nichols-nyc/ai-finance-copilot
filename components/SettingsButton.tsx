'use client'

import { Settings } from 'lucide-react'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SettingsSheet } from '@/components/SettingsSheet'

interface SettingsButtonProps {
  userEmail?: string
}

export function SettingsButton({ userEmail }: SettingsButtonProps) {
  return (
    <SettingsSheet userEmail={userEmail}>
      <SidebarMenuButton className="w-full cursor-pointer">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </SidebarMenuButton>
    </SettingsSheet>
  )
}
