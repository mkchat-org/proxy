# dockerfile generated with claude sonnet 4.5
FROM swift:6.2.0-rhel-ubi9

# Install system dependencies using microdnf
# The 'zlib-devel' package is the RHEL equivalent of 'zlib1g-dev'
# The 'slim' image does not contain the compiler, so a multi-stage build is necessary
# This Dockerfile uses the non-slim image to build first
RUN microdnf update && microdnf install -y zlib-devel

# Set the working directory for your application
WORKDIR /app

# Copy the Swift package manifest and source code to the container
COPY . .

# Build the application for release
RUN swift build --configuration release --static-swift-stdlib

# ---- Next stage: Use a 'slim' image for a smaller final image ----
# Use the slim image for the final production image
FROM swift:6.2.0-rhel-ubi9-slim

# Set the working directory
WORKDIR /app

# Copy the compiled executable from the 'builder' stage
COPY --from=0 /app/.build/release/MKChatProxy .

# Expose the port your app listens on
EXPOSE 8080

# Specify the entry point for the application
ENTRYPOINT ["./MKChatProxy"]
