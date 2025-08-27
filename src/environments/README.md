# Configuração de Environments

Este projeto utiliza a funcionalidade de environments do Angular para configurar diferentes URLs de API e configurações por ambiente.

## Arquivos de Environment

- `environment.ts` - Configuração padrão (desenvolvimento)
- `environment.prod.ts` - Configuração para produção
- `environment.staging.ts` - Configuração para staging
- `environment.local.ts` - Configuração para desenvolvimento local
- `environment.interface.ts` - Interface TypeScript para tipagem

## Como Usar

### 1. Importar o Environment

```typescript
import { environment } from '../environments/environment';

// Usar a URL da API
const apiUrl = environment.apiUrl;
const fullUrl = `${environment.apiUrl}/${environment.apiVersion}/transferencias`;
```

### 2. Verificar o Ambiente

```typescript
if (environment.production) {
  // Lógica específica para produção
  console.log('Executando em produção');
} else {
  // Lógica para desenvolvimento
  console.log('Executando em desenvolvimento');
}
```

## Comandos para Executar

### Desenvolvimento (padrão)
```bash
ng serve
# ou
ng serve --configuration=development
```

### Staging
```bash
ng serve --configuration=staging
```

### Local
```bash
ng serve --configuration=local
```

### Produção
```bash
ng serve --configuration=production
```

## Build para Diferentes Ambientes

### Desenvolvimento
```bash
ng build
```

### Staging
```bash
ng build --configuration=staging
```

### Produção
```bash
ng build --configuration=production
```

### Local
```bash
ng build --configuration=local
```

## Estrutura do Environment

```typescript
export interface Environment {
  production: boolean;      // Indica se está em produção
  apiUrl: string;          // URL base da API
  apiVersion: string;      // Versão da API
  timeout: number;         // Timeout das requisições em ms
  retryAttempts: number;   // Número de tentativas de retry
}
```

## Personalização

Para adicionar novas configurações:

1. Adicione a propriedade na interface `Environment`
2. Atualize todos os arquivos de environment
3. Configure o `angular.json` se necessário

## Exemplo de Uso em Serviços

```typescript
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  
  getFullUrl(endpoint: string): string {
    return `${this.baseUrl}/${this.apiVersion}/${endpoint}`;
  }
}
```
