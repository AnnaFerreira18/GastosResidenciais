namespace Backend.DTOs;

public class CategoriaTotalDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

public class RelatorioCategoriaDto
{
    public List<CategoriaTotalDto> Categorias { get; set; } = new();
    public decimal TotalGeralReceitas { get; set; }
    public decimal TotalGeralDespesas { get; set; }
    public decimal SaldoGeralLiquido { get; set; }
}
