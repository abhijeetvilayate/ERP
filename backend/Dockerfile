# Step 1: Build stage with Maven and Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run stage with Apache Tomcat
FROM tomcat:9.0-jdk17-corretto
RUN rm -rf /usr/local/tomcat/webapps/ROOT
RUN sed -i 's/port="8005"/port="-1"/g' /usr/local/tomcat/conf/server.xml
COPY --from=build /app/target/CollegeERP.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
