"use client"

import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"

interface Note {
  id: number
  text: string
  author: string
  timestamp: string
}

interface AdminNotesProps {
  orderId: number
}

const AdminNotes: React.FC<AdminNotesProps> = ({ orderId }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      text: "Khách hàng yêu cầu giao hàng vào buổi sáng.",
      author: "Admin",
      timestamp: "2025-03-01T09:30:00",
    },
    {
      id: 2,
      text: "Đã liên hệ với khách hàng để xác nhận đơn hàng.",
      author: "Nhân viên CSKH",
      timestamp: "2025-03-01T10:15:00",
    },
  ])
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    if (newNote.trim() === "") return

    const note: Note = {
      id: Date.now(),
      text: newNote,
      author: "Admin",
      timestamp: new Date().toISOString(),
    }

    setNotes([...notes, note])
    setNewNote("")

    // In a real app, you would make an API call to save the note
    // saveNote(orderId, note);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div>
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-900">{note.author}</p>
              <p className="text-xs text-gray-500">{formatDate(note.timestamp)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-600">{note.text}</p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Chưa có ghi chú nào</p>}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Thêm ghi chú mới..."
          className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleAddNote}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default AdminNotes

