FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["SmartStudyPlanner.csproj", "./"]
RUN dotnet restore "SmartStudyPlanner.csproj"

# Copy everything else and build the application
COPY . .
RUN dotnet build "SmartStudyPlanner.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "SmartStudyPlanner.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Run stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "SmartStudyPlanner.dll"]
