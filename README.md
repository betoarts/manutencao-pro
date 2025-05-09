# ManutençãoPro

Sistema de gerenciamento de manutenção industrial desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

- **Dashboard Principal**

  - KPIs em tempo real
  - Ações rápidas
  - Atividades recentes
  - QR Code para doações via PIX

- **Gerenciamento de Ativos**

  - Cadastro de equipamentos
  - Histórico de manutenções
  - Status operacional
  - Documentação técnica

- **Ordens de Serviço**

  - Criação e acompanhamento
  - Priorização
  - Atribuição de equipes
  - Histórico de execução

- **Planos de Manutenção**

  - Manutenção preventiva
  - Manutenção preditiva
  - Agendamento automático
  - Controle de frequência

- **Inventário**
  - Controle de estoque
  - Alertas de estoque baixo
  - Gestão de fornecedores
  - Histórico de movimentações

## 🛠️ Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Framer Motion
- Supabase
- Capacitor (para versão Android)

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/betoarts/manutencao-pro.git
cd manutencao-pro
```

2. Instale as dependências:

```bash
npm install --legacy-peer-deps
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 📱 Versão Android

Para gerar a versão Android:

1. Instale as dependências do Capacitor:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --legacy-peer-deps
```

2. Construa a versão web:

```bash
npm run build
```

3. Copie os arquivos para o projeto Android:

```bash
npx cap copy android
```

4. Sincronize o projeto:

```bash
npx cap sync android
```

5. Abra no Android Studio:

```bash
npx cap open android
```

6. No Android Studio:
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
   - O APK será gerado em: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🎨 Interface

O sistema possui uma interface moderna e responsiva, com:

- Tema claro/escuro
- Layout adaptativo para mobile e desktop
- Animações suaves
- Componentes interativos
- Feedback visual para ações do usuário

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Humberto Moura Neto

- Email: humbertomoura.neto@gmail.com
- GitHub: [seu-usuario-github]

## 🙏 Agradecimentos

- Comunidade React
- Equipe do Vite
- Equipe do Tailwind CSS
- Equipe do Shadcn/ui
- Todos os contribuidores do projeto
