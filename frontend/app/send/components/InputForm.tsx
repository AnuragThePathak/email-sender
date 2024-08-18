"use client"

import { Card, Label, TextInput, Button, Spinner } from "flowbite-react"
import { useState, ChangeEvent, useRef, SetStateAction } from "react"
import toast from "react-hot-toast"
import RichTextEditor from "./RichTextEditor"
import { Editor as TinyMCEEditor } from 'tinymce'

export default function InputForm() {
	const [userInput, setUserInput] = useState({
		to: "",
		subject: "",
		message: "",
	})
	const [file, setFile] = useState<File | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const editorRef = useRef<TinyMCEEditor | null>(null)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setUserInput({ ...userInput, [name]: value })
	}

	const handleEditorChange = (content: string) => {
		setUserInput({ ...userInput, message: content })
	}

	const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!userInput.to || !userInput.subject || !userInput.message) {
			toast.error("Please fill all fields")
			return
		}

		setIsSubmitting(true)
		const formData = new FormData()
		formData.append("to", userInput.to)
		formData.append("subject", userInput.subject)
		formData.append("text", userInput.message)
		formData.append("isHtml", "true")
		let url = `${process.env.NEXT_PUBLIC_SERVER_ADRRESS!}/send`
		if (file) {
			formData.append("file", file)
			url += "/attachment"
		}
		// Send email
		try {
			await fetch(url, {
				method: "POST",
				body: formData
			})
		} catch (error) {
			console.error(error)
			toast.error("Failed to send email")
			setIsSubmitting(false)
			return
		}

		// Clear form
		editorRef.current?.resetContent()
		setUserInput({ to: "", subject: "", message: "" })
		setFile(null)
		setIsSubmitting(false)
		toast.success("Email sent")
	}

	return (
		<Card className="max-w-lg w-1/2">
			<h1 className="text-2xl font-semibold">Send Email</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<div className="mb-2 block">
						<Label htmlFor="to" value="To" />
					</div>
					<TextInput
						id="to"
						name="to"
						type="email"
						placeholder="Receiver Email/s"
						required
						value={userInput.to}
						onChange={handleChange}
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="subject" value="Subject" />
					</div>
					<TextInput
						id="subject"
						name="subject"
						type="text"
						placeholder="Subject"
						required
						value={userInput.subject}
						onChange={handleChange}
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="message" value="Message" />
					</div>
					<RichTextEditor
						editorRef={editorRef}
						handleChange={handleEditorChange}
						handleFileChange={(file: File) => setFile(file)}
						isSubmitting={isSubmitting}
					/>
				</div>
				<Button type="submit" disabled={isSubmitting}>
					{
						isSubmitting ?
							(<><Spinner aria-label="Spinner button example" size="sm" />
								<span className="pl-3">Sending...</span></>)
							: "Send"
					}
				</Button>
			</form>
		</Card>
	)
}
