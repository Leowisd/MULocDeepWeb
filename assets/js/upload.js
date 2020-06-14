/* -------------------------------------------------------------------------- */
/*                               Upload js File                               */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

// custom-file-input displays the name of uploaded
$('.custom-file-input').on('change', function () {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
});

// reset button clears the file name 
$('#reset').click(function () {
    $('#fileLabel').text('Choose file');
})

// Sample button
$('#sample').click(function () {
    $('#sequenceInput').val('>P03070\nMDKVLNREESLQLMDLLGLERSAWGNIPLMRKAYLKKCKEFHPDKGGDEEKMKKMNTLYKKMEDGVKYAHQPDFGGFWDATEIPTYGTDEWEQWWNAFNEENLFCSEEMPSSDDEATADSQHSTPPKKKRKVEDPKDFPSELLSFLSHAVFSNRTLACFAIYTTKEKAALLYKKIMEKYSVTFISRHNSYNHNILFFLTPHRHRVSAINNYAQKLCTFSFLICKGVNKEYLMYSALTRDPFSVIEESLPGGLKEHDFNPEEAEETKQVSWKLVTEYAMETKCDDVLLLLGMYLEFQYSFEMCLKCIKKEQPSHYKYHEKHYANAAIFADSKNQKTICQQAVDTVLAKKRVDSLQLTREQMLTNRFNDLLDRMDIMFGSTGSADIEEWMAGVAWLHCLLPKMDSVVYDFLKCMVYNIPKKRYWLFKGPIDSGKTTLAAALLELCGGKALNVNLPLDRLNFELGVAIDQFLVVFEDVKGTGGESRDLPSGQGINNLDNLRDYLDGSVKVNLEKKHLNKRTQIFPPGIVTMNEYSVPKTLQARFVKQIDFRPKDYLKHCLERSEFLLEKRIIQSGIALLLMLIWYRPVAEFAQSIQSRIVEWKERLDKEFSLSVYQKMKFNVAMGIGVLDWLRNSDDDDEDSQENADKNEDGGEKNMEDSGHETGIDSQSQGSFQAPQSSQSVHDHNQPYHICRGFTCFKKPPTPPPEPET\n>P10238\nMATDIDMLIDLGLDLSDSDLDEDPPEPAESRRDDLESDSSGECSSSDEDMEDPHGEDGPEPILDAARPAVRPSRPEDPGVPSTQTPRPTERQGPNDPQPAPHSVWSRLGARRPSCSPEQHGGKVARLQPPPTKAQPARGGRRGRRRGRGRGGPGAADGLSDPRRRAPRTNRNPGGPRPGAGWTDGPGAPHGEAWRGSEQPDPPGGQRTRGVRQAPPPLMTLAIAPPPADPRAPAPERKAPAADTIDATTRLVLRSISERAAVDRISESFGRSAQVMHDPFGGQPFPAANSPWAPVLAGQGGPFDAETRRVSWETLVAHGPSLYRTFAGNPRAASTAKAMRDCVLRQENFIEALASADETLAWCKMCIHHNLPLRPQDPIIGTTAAVLDNLATRLRPFLQCYLKARGLCGLDELCSRRRLADIKDIASFVFVILARLANRVERGVAEIDYATLGVGVGEKMHFYLPGACMAGLIEILDTHRQECSSRVCELTASHIVAPPYVHGKYFYCNSLF\n>P09462\nMMSFVSLLLVGILFHATQAEQLTKCEVFQELKDLKDYGGVSLPEWVCTAFHTSGYDTQAIVQNNDSTEYGLFQINNKIWCKDDQNPHSRNICNISCDKFLDDDLTDDIMCVKKILDKVGINYWLAHKALCSEKLDQWLCEKL\n>P04037\nMLSLRQSIRFFKPATRTLCSSRYLLQQKPVVKTAQNLAEVNGPETLIGPGAKEGTVPTDLDQETGLARLELLGKLEGIDVFDTKPLDSSRKGTMKDPIIIESYDDYRYVGCTGSPAGSHTIMWLKPTVNEVARCWECGSVYKLNPVGVPNDDHHH\n>P11893\nMVAMAMASLQSSMSSLSLSSNSFLGQPLSPITLSPFLQGKPTEKKCLIVMKLKRWERKECKPNSLPVLHKLHVKVGDTVKVISGHEKGQIGEITKIFKHNSSVIVKDINLKTKHVKSNQEGEPGQINKVEAPIHSSNVMLYSKEKDVTSRVGHKVLENGKRVRYLIKTGEIIDSEENWKKLKEANKKTAEVAAT');
    $('#nickName1').val('Example Case');
    $('#emailInput1').val('examplecase@MULocDeep.com');
})


/**
 * Check if copied sequences are valid
 *
 * @returns
 */
function checkSeqValid() {
    let seq = $('#sequenceInput').val().trim();
    if (!seq){
        $('#errorModalBody').text("Query cannot be empty.");
        $('#errorModal').modal('show');
        return false;
    }

    let data = seq.split('>');
    let num = 0;
    for (let i = 0; i < data.length; i++) {
        let fasta = data[i];
        if (i == 0 && fasta){
            $('#errorModalBody').text("The description of queries must begin with >." );
            $('#errorModal').modal('show');
            return false;
        }
        if (!fasta) continue;

        let lines = fasta.split(/\r?\n/);
        lines.splice(0, 1);

        // join the array back into a single string without newlines and 
        // trailing or leading spaces
        fasta = lines.join('').trim();

        if (!fasta) { // is it empty whatever we collected ? re-check not efficient 
            $('#errorModalBody').text("Query must contain amino acid code sequence.");
            $('#errorModal').modal('show');
            return false;
        }
        // console.log(fasta);
        // return false;

        // note that the empty string is caught above
        // allow for Selenocysteine (U)
        if (/^[ACDEFGHIKLMNPQRSTUVWY]+$/i.test(fasta) == false){
            $('#errorModalBody').text("Sequences must be in valid amino acid code(A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, U, V, W, Y) without any space.");
            $('#errorModal').modal('show');
            return false;
        }

        num = num + 1;
    }
    if (num > 200){
        $('#errorModalBody').text("The number of sequences " + num + " is out of the limit: 200.");
        $('#errorModal').modal('show');
        return false;
    }
    return true;
}


/**
 * Check if uploaded file is valid 
 *
 */
function checkFileValid() {
    let objFile = document.getElementById("fileSelect");

    // console.log(objFile.files[0].size); // 文件字节数

    let files = $('#fileSelect').prop('files');//获取到文件列表

    let reader = new FileReader();//新建一个FileReader
    reader.readAsText(files[0], "UTF-8");//读取文件
    reader.onload = function (evt) { //读取完文件之后会回来这里

        let seq = evt.target.result.trim(); // 读取文件内容
        if (!seq){
            $('#errorModalBody').text("Query cannot be empty.");
            $('#errorModal').modal('show');
            return false;
        }
            
        let data = seq.split('>');
        let num = 0;
        for (let i = 0; i < data.length; i++) {
            let fasta = data[i];
            if (i == 0 && fasta){
                $('#errorModalBody').text("The description of query must begin with >.");
                $('#errorModal').modal('show');
                $('#reset').click();
            }
            if (!fasta) continue;

            let lines = fasta.split(/\r?\n/);
            lines.splice(0, 1);

            // join the array back into a single string without newlines and 
            // trailing or leading spaces
            fasta = lines.join('').trim();

            if (!fasta) { // is it empty whatever we collected ? re-check not efficient 
                $('#errorModalBody').text("Query must contain amino acid code sequence.");
                $('#errorModal').modal('show');
                $('#reset').click();
            }

            // note that the empty string is caught above
            // allow for Selenocysteine (U)
            if(/^[ACDEFGHIKLMNPQRSTUVWY]+$/i.test(fasta) == false){
                $('#errorModalBody').text("Sequences must be in valid amino acid code(A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, U, V, W, Y) without any space.");
                $('#errorModal').modal('show');
                $('#reset').click();
            }

            num = num + 1;
        }
        if (num > 200){
            $('#errorModalBody').text("The number of sequences " + num + " is out of the limit: 200.");
            $('#errorModal').modal('show');
            $('#reset').click();
        }
    }
}