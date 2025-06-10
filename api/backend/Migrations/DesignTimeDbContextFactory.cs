using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TheFirmApi.Data;

namespace TheFirmApi.Migrations;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Use a connection string for design-time only
        optionsBuilder.UseOracle("User Id=system;Password=oracle;Data Source=localhost:1521/FREEPDB1",
            oracleOptions => oracleOptions.UseOracleSQLCompatibility(OracleSQLCompatibility.DatabaseVersion19));
        
        return new AppDbContext(optionsBuilder.Options);
    }
} 