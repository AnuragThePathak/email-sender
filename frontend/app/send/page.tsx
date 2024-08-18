import { Button, Card, Label, Textarea, TextInput } from "flowbite-react"
import { ChangeEvent, useState } from "react"
import { Toaster } from "react-hot-toast"
import InputForm from "./components/InputForm"

export default function SendPage() {

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Toaster />
			<InputForm />
		</main>
	)
}