# RGR Agendamento - Frontend

Sistema de agendamento desenvolvido com Angular 18 seguindo o padrão arquitetural MVVM.

## 🚀 Tecnologias

- **Angular 18** - Framework principal com SSR (Server-Side Rendering)
- **TypeScript 5.5** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **HTTP Client** - Configurado com `withFetch()` para melhor performance
- **RxJS 7.8** - Biblioteca para programação reativa
- **Express** - Servidor para SSR

## 🌍 Configuração de Environments

O projeto utiliza a funcionalidade de environments do Angular para configurar diferentes URLs de API e configurações por ambiente.

### Arquivos de Environment

- `src/environments/environment.ts` - Configuração padrão (desenvolvimento)
- `src/environments/environment.prod.ts` - Configuração para produção
- `src/environments/environment.staging.ts` - Configuração para staging
- `src/environments/environment.local.ts` - Configuração para desenvolvimento local
- `src/environments/environment.interface.ts` - Interface TypeScript para tipagem

### URLs por Ambiente

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://api.staging.com/api`
- **Production**: `https://api.producao.com/api`
- **Local**: `http://localhost:8080/api/v1`

### Endpoints da API

- **Taxas de Transferência**: `/taxa-transferencia`
  - `GET /taxa-transferencia` - Lista todas as taxas
  - `POST /taxa-transferencia/calcular` - Calcula taxa para transferência
- **Agendamentos**: `/agendamento`
  - `GET /agendamento` - Lista todos os agendamentos
  - `POST /agendamento` - Cria novo agendamento

### Comandos para Executar

```bash
# Desenvolvimento (padrão)
npm start
npm run start:dev

# Staging
npm run start:staging

# Local
npm run start:local

# Produção
npm run start:prod
```

### Build para Diferentes Ambientes

```bash
# Desenvolvimento
npm run build:dev

# Staging
npm run build:staging

# Produção
npm run build:prod

# Local
npm run build:local
```

### Como Usar no Código

```typescript
import { environment } from '../environments/environment';

// Usar a URL da API
const apiUrl = environment.apiUrl;
const fullUrl = `${environment.apiUrl}/${environment.apiVersion}/transferencias`;

// Verificar o ambiente
if (environment.production) {
  console.log('Executando em produção');
} else {
  console.log('Executando em desenvolvimento');
}
```

## 🏗️ Arquitetura MVVM

O projeto segue o padrão Model-View-ViewModel (MVVM) com uma estrutura bem organizada:

```
src/app/
├── models/          # Modelos de dados (request/response)
├── views/           # Componentes de visualização
├── viewmodels/      # Lógica de negócio e estado
├── services/        # Serviços de comunicação com API
├── shared/          # Componentes, pipes e diretivas compartilhadas
└── core/            # Funcionalidades centrais (base classes, interfaces)
    ├── components/  # Componentes base
    ├── services/    # Serviços base
    ├── viewmodels/  # ViewModels base
    ├── interfaces/  # Interfaces base
    ├── interceptors/# Interceptadores HTTP
    └── guards/      # Guards de rota
```

### Estrutura MVVM:

- **Models**: Interfaces e tipos de dados organizados em `request/` e `response/`
- **Views**: Componentes Angular (templates e estilos) para cada funcionalidade
- **ViewModels**: Classes que gerenciam estado e lógica de negócio
- **Services**: Comunicação com APIs externas, estendendo `BaseService<T>`
- **Core**: Classes base abstratas para reutilização de código

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

1. **Model**: Criar interfaces em `models/request/` e `models/response/`
2. **Service**: Estender `BaseService<T>` em `services/` ou criar serviço customizado
3. **ViewModel**: Criar ViewModel customizado ou estender `BaseViewModel<T>` se aplicável
4. **View**: Criar componente em `views/` com template e estilos

### Exemplo de uso:

```typescript
// Model Request
export interface UserRequest {
  name: string;
  email: string;
}

// Model Response
export interface UserResponse extends BaseModel {
  name: string;
  email: string;
}

// Service
@Injectable()
export class UserService extends BaseService<UserResponse> {
  protected apiUrl = environment.apiUrl + '/users';
}

// ViewModel
@Injectable()
export class UserViewModel {
  private usersSubject = new BehaviorSubject<UserResponse[]>([]);
  public users$ = this.usersSubject.asObservable();
  
  constructor(private userService: UserService) {}
  
  loadUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.usersSubject.next(users);
    });
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

## 🎯 Funcionalidades Principais

### Sistema de Agendamento de Transferências
- **Agendamento**: Formulário para criar transferências financeiras com validações
- **Extrato**: Visualização de todos os agendamentos realizados em tabela
- **Tabela de Taxas**: Consulta das taxas aplicáveis por dias de transferência
- **Cálculo de Taxas**: Sistema automático de cálculo baseado em dias e valores
- **Validações**: Controle de contas de origem e destino, valores e datas

### Serviços de API
- **TaxaTransferenciaService**: 
  - `getAll()` - Lista todas as taxas disponíveis
  - `calcularTaxaTransferencia()` - Calcula taxa para transferência específica
- **AgendamentoService**: 
  - `getAll()` - Lista todos os agendamentos
  - `postAgendamento()` - Cria novo agendamento
- **BaseService<T>**: Classe base abstrata com CRUD completo
- **HTTP Client**: Configurado com interceptors e fetch API

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── core/           # Funcionalidades centrais
│   │   ├── components/ # Componentes base
│   │   ├── services/   # Serviços base
│   │   ├── viewmodels/ # ViewModels base
│   │   ├── interfaces/ # Interfaces base
│   │   ├── interceptors/# Interceptadores HTTP
│   │   └── guards/     # Guards de rota
│   ├── models/         # Modelos de dados
│   │   ├── request/    # DTOs de requisição
│   │   └── response/   # DTOs de resposta
│   ├── services/       # Serviços de negócio
│   ├── shared/         # Componentes compartilhados
│   ├── viewmodels/     # ViewModels de negócio
│   ├── views/          # Componentes de visualização
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── i18n/          # Arquivos de tradução
├── environments/       # Configurações por ambiente
└── styles.scss        # Estilos globais
```

## 🚀 Scripts Disponíveis

### Desenvolvimento
- `npm start` - Inicia o servidor de desenvolvimento (padrão)
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run start:staging` - Inicia em modo staging
- `npm run start:local` - Inicia em modo local
- `npm run start:prod` - Inicia em modo produção

### Build
- `npm run build` - Gera build de desenvolvimento
- `npm run build:dev` - Gera build de desenvolvimento
- `npm run build:staging` - Gera build de staging
- `npm run build:prod` - Gera build de produção
- `npm run build:local` - Gera build de local

### Outros
- `npm run test` - Executa testes unitários
- `npm run lint` - Executa linting do código

## ⚙️ Configurações Especiais

### HTTP Client com Fetch API
O projeto está configurado para usar `withFetch()` no `HttpClient` para melhor performance e compatibilidade com SSR:

```typescript
// app.config.ts
provideHttpClient(withInterceptorsFromDi(), withFetch())
```

### Estilos e Componentes
- **CSS Customizado**: Sistema de estilos próprio com variáveis CSS customizadas
- **Responsividade**: Layout adaptável para diferentes tamanhos de tela
- **Design System**: Componentes reutilizáveis com estilos consistentes
- **Tabelas**: Sistema de tabelas responsivo com estilos customizados

### Modelos de Dados
- **TaxaTransferencia**: `diaDe`, `diaAte`, `taxa`, `porcentagem`
- **CalcularTaxaTransferencia**: `contaOrigem`, `contaDestino`, `valor`, `dataTransferencia`, `dataAgendamento`
- **Agendamento**: `codigoAgendamento`, `statusAgendamento`, `contaOrigem`, `contaDestino`, `valor`, `taxa`, `dataTransferencia`, `dataAgendamento`

## 📝 Licença

Este projeto é parte do sistema RGR Agendamento.
