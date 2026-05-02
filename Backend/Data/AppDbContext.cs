using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Aplicando a regra: Deletar pessoa apaga suas transações (Cascade)
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Pessoa)
            .WithMany(p => p.Transacoes)
            .HasForeignKey(t => t.IdPessoa)
            .OnDelete(DeleteBehavior.Cascade);

        // Apenas definindo o comportamento padrão para Categoria (Restrict) 
        // para evitar apagar uma categoria que tenha transações vinculadas.
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Categoria)
            .WithMany()
            .HasForeignKey(t => t.IdCategoria)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}
