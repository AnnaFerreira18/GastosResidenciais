// Enums
export const TipoTransacao = {
    Receita: 1,
    Despesa: 2
} as const;
export type TipoTransacao = (typeof TipoTransacao)[keyof typeof TipoTransacao];

export const FinalidadeCategoria = {
    Receita: 1,
    Despesa: 2,
    Ambas: 3
} as const;
export type FinalidadeCategoria = (typeof FinalidadeCategoria)[keyof typeof FinalidadeCategoria];

// Interfaces (Pessoa, categoria, transação e relatorio)
export interface Pessoa {
    id?: number;
    nome: string;
    idade: number;
}

export interface Categoria {
    id?: number;
    descricao: string;
    finalidade: FinalidadeCategoria;
}

export interface Transacao {
    id?: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    idCategoria: number;
    idPessoa: number;
    pessoa?: Pessoa;
    categoria?: Categoria;
}

export interface PessoaTotal {
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioGeral {
    pessoas: PessoaTotal[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoGeralLiquido: number;
}

export interface CategoriaTotal {
    descricao: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioCategoria {
    categorias: CategoriaTotal[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoGeralLiquido: number;
}