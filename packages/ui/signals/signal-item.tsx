import React from "react"
import type { ISignal } from "@radar/types"

interface SignalItemProps {
  signal: ISignal
}

export const SignalItem: React.FC<SignalItemProps> = ({ signal }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <p className="text-white font-bold">
        Señal de {signal.Sender?.firstName ?? ""}
      </p>
      {signal.note ? (
        <p className="text-gray-300 mt-2">
          {signal.note}
        </p>
      ) : null}
    </div>
  )
}
