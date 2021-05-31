import React, { useEffect, useRef } from 'react'
import { useRokt } from '../context/rokt'

export function ConfirmationPage() {
  const rokt = useRokt()
  const placeholderRef = useRef(null)

  useEffect(() => {
    if (!placeholderRef.current) {
      return
    }
    rokt.setAttributes({
      email: 'user@example.com',
    })
    rokt.triggerPageChange('checkout.page')

    return () => {
      rokt.closeAll()
    }
  }, [placeholderRef.current, rokt])

  return (
    <div>
      <h1>Confirmation Page</h1>
      <div
        ref={placeholderRef}
        id="rokt-placeholder"
      />
    </div>
  )
}
