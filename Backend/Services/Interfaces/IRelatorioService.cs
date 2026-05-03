using Backend.DTOs;

namespace Backend.Services.Interfaces;

public interface IRelatorioService
{
    Task<RelatorioGeralDto> ObterRelatorioTotaisAsync();
    Task<RelatorioCategoriaDto> ObterRelatorioPorCategoriaAsync();
}


