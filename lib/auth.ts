@@ .. @@
 export async function createToken(user: User): Promise<string> {
   return await new SignJWT({ user })
     .setProtectedHeader({ alg: 'RS256', kid: 'dev-rsa-1' })
     .setIssuedAt()
     .setExpirationTime('10m')
-    .sign(secret);
+    .sign(privateKey);
 }