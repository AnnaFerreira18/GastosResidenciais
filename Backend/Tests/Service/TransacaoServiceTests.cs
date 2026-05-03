using Backend.Data;
using Xunit;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Enums;

namespace Backend.Tests.Service;

public class TransacaoServiceTests
{
    // Método para criar um banco de dados na memória para cada teste
    private AppDbContext ObterContextoEmMemoria()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CriarTransacao_MenorDeIdadeTentandoReceita_DeveLancarExcecao()
    {
        // Arrange 
        var context = ObterContextoEmMemoria();

        // Criamos uma pessoa menor de idade e uma categoria de receita
        var pessoa = new Pessoa { Id = 1, Nome = "Joãozinho", Idade = 17 };
        var categoria = new Categoria { Id = 1, Descricao = "Mesada", Finalidade = FinalidadeCategoria.Receita };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);

        var dto = new TransacaoRequestDto
        {
            Descricao = "Ganhando mesada do avô",
            Valor = 50m,
            Tipo = TipoTransacao.Receita,
            IdCategoria = 1,
            IdPessoa = 1
        };

        // Act & Assert (Ação e Validação)
        // Esperamos que o método lance uma InvalidOperationException com a nossa mensagem exata
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarTransacaoAsync(dto));

        Assert.Equal("Menores de 18 anos só podem registrar transações do tipo Despesa.", exception.Message);
    }

    [Fact]
    public async Task CriarTransacao_MaiorDeIdadeComDadosValidos_DeveSalvarTransacao()
    {
        // Arrange
        var context = ObterContextoEmMemoria();

        var pessoa = new Pessoa { Id = 2, Nome = "Carlos", Idade = 30 };
        var categoria = new Categoria { Id = 2, Descricao = "Salário", Finalidade = FinalidadeCategoria.Receita };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);

        var dto = new TransacaoRequestDto
        {
            Descricao = "Pagamento da empresa",
            Valor = 5000m,
            Tipo = TipoTransacao.Receita,
            IdCategoria = 2,
            IdPessoa = 2
        };

        // Act
        var transacao = await service.CriarTransacaoAsync(dto);

        // Assert
        Assert.NotNull(transacao);
        Assert.Equal(5000m, transacao.Valor);
        Assert.Equal("Pagamento da empresa", transacao.Descricao);
        Assert.Equal(1, context.Transacoes.Count()); 
    }

    [Fact]
    public async Task CriarTransacao_TipoReceitaComCategoriaDespesa_DeveLancarExcecao()
    {
        // Arrange
        var context = ObterContextoEmMemoria();

        var pessoa = new Pessoa { Id = 10, Nome = "Ana", Idade = 25 };
        // Categoria configurada apenas para DESPESA
        var categoria = new Categoria { Id = 10, Descricao = "Aluguel", Finalidade = FinalidadeCategoria.Despesa };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);

        var dto = new TransacaoRequestDto
        {
            Descricao = "Tentando ganhar dinheiro com aluguel (errado)",
            Valor = 1000m,
            Tipo = TipoTransacao.Receita, // Tipo incompatível com a categoria
            IdCategoria = 10,
            IdPessoa = 10
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarTransacaoAsync(dto));
        Assert.Equal("A categoria escolhida não permite este tipo de transação.", exception.Message);
    }

    [Fact]
    public async Task CriarTransacao_CategoriaAmbas_DeveAceitarQualquerTipo()
    {
        // Arrange
        var context = ObterContextoEmMemoria();

        var pessoa = new Pessoa { Id = 11, Nome = "Bruno", Idade = 20 };
        // Categoria configurada para AMBAS
        var categoria = new Categoria { Id = 11, Descricao = "Outros", Finalidade = FinalidadeCategoria.Ambas };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);

        var dtoReceita = new TransacaoRequestDto
        {
            Descricao = "Receita",
            Valor = 10,
            Tipo = TipoTransacao.Receita,
            IdCategoria = 11,
            IdPessoa = 11
        };

        var dtoDespesa = new TransacaoRequestDto
        {
            Descricao = "Despesa",
            Valor = 10,
            Tipo = TipoTransacao.Despesa,
            IdCategoria = 11,
            IdPessoa = 11
        };

        // Act
        var transacao1 = await service.CriarTransacaoAsync(dtoReceita);
        var transacao2 = await service.CriarTransacaoAsync(dtoDespesa);

        // Assert
        Assert.NotNull(transacao1);
        Assert.NotNull(transacao2);
        Assert.Equal(2, context.Transacoes.Count());
    }
}
