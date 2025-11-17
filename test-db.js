const { createClient } = require("@supabase/supabase-js")

async function test() {
  try {
    console.log("Testing Supabase connection...")
    
    // Test authentication
    const { data, error } = await createClient.auth.signIn({
      email: "test@example.com",
      password: "testpassword"
    })

    if (error) {
      console.error("❌ Auth test failed:", error.message)
      return
    }

    console.log("✅ Auth test successful:", data.user?.email || "No user")
    
    console.log("Test completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
    }
  }
}

test()
