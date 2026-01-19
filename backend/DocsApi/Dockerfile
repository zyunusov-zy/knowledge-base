# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and csproj files
COPY DocsApi.sln .
COPY DocsApi.API/DocsApi.API.csproj DocsApi.API/
COPY DocsApi.Core/DocsApi.Core.csproj DocsApi.Core/
COPY DocsApi.Infrastructure/DocsApi.Infrastructure.csproj DocsApi.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy everything else
COPY . .

# Publish API project (ALLOW restore here)
RUN dotnet publish DocsApi.API \
    -c Release \
    -o /app/publish

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "DocsApi.API.dll"]
