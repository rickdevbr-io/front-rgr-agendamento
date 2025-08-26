# RGR Agendamento - Frontend

Sistema de agendamento desenvolvido com Angular 18 seguindo o padrão arquitetural MVVM.

## 🚀 Tecnologias

- **Angular 18** - Framework principal
- **PrimeNG 18** - Biblioteca de componentes UI
- **Transloco** - Sistema de internacionalização
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS

## 🏗️ Arquitetura MVVM

O projeto segue o padrão Model-View-ViewModel (MVVM):

```
src/app/
├── models/          # Modelos de dados
├── views/           # Componentes de visualização
├── viewmodels/      # Lógica de negócio e estado
├── services/        # Serviços de comunicação com API
├── shared/          # Componentes, pipes e diretivas compartilhadas
└── core/            # Funcionalidades centrais (guards, interceptors)
```

### Estrutura MVVM:

- **Models**: Interfaces e tipos de dados
- **Views**: Componentes Angular (templates e estilos)
- **ViewModels**: Classes que gerenciam estado e lógica de negócio
- **Services**: Comunicação com APIs externas

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

4. Acesse: `http://localhost:4200`

## 🔧 Desenvolvimento

### Criando um novo módulo MVVM:

1. **Model**: Criar interface em `models/`
2. **Service**: Estender `BaseService<T>` em `services/`
3. **ViewModel**: Estender `BaseViewModel<T>` em `viewmodels/`
4. **View**: Criar componente em `views/`

### Exemplo de uso:

```typescript
// Model
export interface User extends BaseModel {
  name: string;
  email: string;
}

// Service
@Injectable()
export class UserService extends BaseService<User> {
  protected apiUrl = '/api/users';
}

// ViewModel
@Injectable()
export class UserViewModel extends BaseViewModel<User> {
  constructor(service: UserService) {
    super(service);
  }
}

// View
@Component({
  selector: 'app-users',
  providers: [UserViewModel]
})
export class UsersComponent extends BaseComponent {
  constructor(public vm: UserViewModel) {
    super();
  }
}
```

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── core/           # Funcionalidades centrais
│   ├── models/         # Modelos de dados
│   ├── services/       # Serviços
│   ├── shared/         # Componentes compartilhados
│   ├── viewmodels/     # ViewModels
│   ├── views/          # Componentes de visualização
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── i18n/          # Arquivos de tradução
└── styles.scss        # Estilos globais
```

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run test` - Executa testes unitários
- `npm run lint` - Executa linting do código

## 📝 Licença

Este projeto é parte do sistema RGR Agendamento.
