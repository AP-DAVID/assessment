# 💰 Financial Dashboard

Welcome to my Assessment

---

## ✨ Features

- Real-time overview of your financial accounts
- Track spending habits with charts
- Monitor card balances
- Transfer money between accounts
- Mobile-friendly responsive design
- Customizable user settings

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + chartjs-plugin-datalabels
- **State Management**: Context API
- **Testing**: Jest & React Testing Library
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- pnpm (**recommended**). Install with:

I'm using **pnpm** for this project. If you haven't tried it yet, here's how to get it:

```bash
npm install -g pnpm
```

Please use **pnpm** to avoid dependency issues

Why did I use pnpm?
I started using pnpm about a year ago and it's been a game-changer for me:

It’s FAST. Like, really fast compared to npm

Saves tons of disk space (my laptop thanked me)

The dependency management is more logical and secure

Works great with monorepos if you're into that

### Installation

```bash
git clone https://github.com/AP-DAVID/assessment.git
cd assessment
pnpm install
```

### Running the app

```bash
# Development mode
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

App will be running at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

I am not comfortable shipping code without tests (learned that lesson the hard way). I have set up Jest and React Testing Library to make sure everything works as expected.

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

Test coverage focuses on critical components and logic.

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js app router
├── components/           # Reusable UI components
├── context/              # Global state management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # Mock API layer
└── __tests__/            # Unit & integration tests
```

---

## ⚠️ Notes

- Please use **pnpm** to avoid dependency issues
- Requires **Node.js 18.17.0+**
- Mock data can be found in `services/api.ts`
- No real backend or auth — just mock and UI

---

## 🌐 Browser Support

Tested on:

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---
PS, I did not include the company's name in the README or the repository name to prevent it being seen and copied via a github search
Happy coding! ✌️
