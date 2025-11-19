import { useState } from "react";

export default function SupportForm() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("support");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!email.trim()) newErrors.email = "Введите Email";
    if (!topic.trim()) newErrors.topic = "Введите тему";
    if (!message.trim()) newErrors.message = "Введите описание";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("Support request:", {
      email,
      topic,
      recipient,
      message,
    });

    setStatus("Ваш запрос отправлен!");
    setEmail("");
    setTopic("");
    setRecipient("support");
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Связаться с поддержкой</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 p-6 rounded-xl border border-black/10"
      >
        {/* EMAIL */}
        <div>
          <label className="block mb-2 font-medium">Ваш Email</label>
          <input
            type="email"
            className={`w-full px-4 py-3 rounded-lg bg-black/10 
              border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/30 focus:border-indigo-500"
              }
              outline-none transition hover:border-black/40`}
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* TOPIC */}
        <div>
          <label className="block mb-2 font-medium">Тема</label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-lg bg-black/10 
              border ${
                errors.topic
                  ? "border-red-500 focus:border-red-500"
                  : "border-black/30 focus:border-indigo-500"
              }
              outline-none transition hover:border-black/40`}
            placeholder="Например: Ошибка при загрузке документа"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          {errors.topic && (
            <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
          )}
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block mb-2 font-medium">Описание</label>
          <textarea
            className={`w-full px-4 py-3 rounded-lg bg-black/10 h-32 resize-none
              border ${
                errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-black/30 focus:border-indigo-500"
              }
              outline-none transition hover:border-black/40`}
            placeholder="Опишите вашу проблему..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 
            transition font-semibold"
        >
          Отправить
        </button>

        {status && (
          <p className="text-center text-sm text-indigo-300 mt-2">{status}</p>
        )}
      </form>

      {/* CONTACT INFO */}
      <div className="mt-10 bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Доп. контакты</h3>

        <p className="mb-2">
          <span className="font-medium">Телефон:</span> +998 (90) 123-45-67
        </p>

        <p className="mb-2">
          <span className="font-medium">Email:</span> support@docportal.uz
        </p>

        <p>
          <span className="font-medium">Telegram:</span>{" "}
          <a
            href="https://t.me/docportal_support"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline"
          >
            @docportal_support
          </a>
        </p>
      </div>
    </div>
  );
}
